import { BlobServiceClient, ContainerClient, StorageSharedKeyCredential } from '@azure/storage-blob';
import { UploadService } from './upload.service';
import { UploadFileOptions, UploadFileResult } from './upload.types';
import appConfig from '../../config/app.config';

export class AzureBlobStorageService extends UploadService {
  private containerClient: ContainerClient;
  private baseUrl: string;
  private connectionString: string;

  constructor() {
    super();
    const config = appConfig.azureStorage;
    const connStr = config.connectionString;

    if (!connStr) {
      throw new Error('Azure Storage connection string is not configured');
    }

    this.connectionString = connStr;

    const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);
    this.containerClient = blobServiceClient.getContainerClient(config.containerName || 'uploads');
    this.baseUrl = config.assignedDomain || `https://${config.defaultDomain}/${config.containerName}`;
  }

  async uploadFile(buffer: Buffer, options: UploadFileOptions): Promise<UploadFileResult> {
    const fileName = options.fileName || `${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const folder = options.folder || '';
    const blobName = folder ? `${folder}/${fileName}` : fileName;

    const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(buffer, {
      blobHTTPHeaders: {
        blobContentType: options.mimeType || 'application/octet-stream',
      },
    });

    return {
      url: `${this.baseUrl}/${blobName}`,
      key: blobName,
      bucket: this.containerClient.containerName,
    };
  }

  async deleteFile(key: string): Promise<void> {
    const blockBlobClient = this.containerClient.getBlockBlobClient(key);
    await blockBlobClient.delete();
  }

  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    const sasToken = this.generateSasToken(key, expiresIn);
    return `${this.baseUrl}/${key}?${sasToken}`;
  }

  private generateSasToken(key: string, expiresIn: number): string {
    const match = this.connectionString.match(/AccountName=([^;]+)/);
    const matchKey = this.connectionString.match(/AccountKey=([^;]+)/);

    if (!match || !matchKey) {
      throw new Error('Invalid Azure Storage connection string format');
    }

    const accountName = match[1];
    const accountKey = matchKey[1];

    const expiryDate = new Date();
    expiryDate.setSeconds(expiryDate.getSeconds() + expiresIn);

    const permissions = 'racwd';
    const version = '2021-06-08';

    const startTime = new Date();
    startTime.setMinutes(startTime.getMinutes() - 5);

    const stringToSign = [
      permissions,
      startTime.toISOString(),
      expiryDate.toISOString(),
      `/${accountName}/${this.containerClient.containerName}/${key}`,
      accountName,
    ].join('\n');

    const crypto = require('crypto');
    const signature = crypto.createHmac('sha256', Buffer.from(accountKey, 'base64')).update(stringToSign).digest('base64');

    const sasToken = new URLSearchParams({
      sv: version,
      ss: 'b',
      sp: permissions,
      st: startTime.toISOString(),
      se: expiryDate.toISOString(),
      sig: signature,
    });

    return sasToken.toString();
  }
}
