export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  body: string;
  html?: string;
  from?: string;
  replyTo?: string;
  cc?: string | string[];
  bcc?: string | string[];
}

export interface EmailResult {
  messageId: string;
  accepted: string[];
  rejected: string[];
}

export interface IEmailService {
  sendEmail(options: SendEmailOptions): Promise<EmailResult>;
  sendBulkEmails(options: SendEmailOptions[]): Promise<EmailResult[]>;
}
