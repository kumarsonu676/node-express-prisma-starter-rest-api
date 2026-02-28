import { IEmailService, SendEmailOptions, EmailResult } from './email.types';

export abstract class EmailService implements IEmailService {
  abstract sendEmail(options: SendEmailOptions): Promise<EmailResult>;
  abstract sendBulkEmails(options: SendEmailOptions[]): Promise<EmailResult[]>;
}
