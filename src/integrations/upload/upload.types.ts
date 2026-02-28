export interface UploadFileOptions {
  folder?: string;
  fileName?: string;
  mimeType?: string;
}

export interface UploadFileResult {
  url: string;
  key?: string;
  bucket?: string;
}

export interface IUploadService {
  uploadFile(buffer: Buffer, options: UploadFileOptions): Promise<UploadFileResult>;
  deleteFile(key: string): Promise<void>;
  getSignedUrl(key: string, expiresIn?: number): Promise<string>;
}
