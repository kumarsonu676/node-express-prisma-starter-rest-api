import { IUploadService, UploadFileOptions, UploadFileResult } from './upload.types';

export abstract class UploadService implements IUploadService {
  abstract uploadFile(buffer: Buffer, options: UploadFileOptions): Promise<UploadFileResult>;
  abstract deleteFile(key: string): Promise<void>;
  abstract getSignedUrl(key: string, expiresIn?: number): Promise<string>;
}
