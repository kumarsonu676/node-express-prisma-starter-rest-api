import nodemailer, { Transporter } from 'nodemailer';
import { EmailService } from './email.service';
import { SendEmailOptions, EmailResult } from './email.types';
import appConfig from '../../config/app.config';

export class SmtpEmailService extends EmailService {
  private transporter: Transporter;

  constructor() {
    super();
    const { smtp } = appConfig;

    this.transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.port === 465,
      auth:
        smtp.username && smtp.password
          ? {
              user: smtp.username,
              pass: smtp.password,
            }
          : undefined,
    });
  }

  async sendEmail(options: SendEmailOptions): Promise<EmailResult> {
    const { email: emailConfig } = appConfig;

    const mailOptions = {
      from: options.from || `${emailConfig.fromName} <${emailConfig.fromEmail}>`,
      to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
      subject: options.subject,
      text: options.body,
      html: options.html,
      replyTo: options.replyTo || `${emailConfig.replyToName} <${emailConfig.replyToEmail}>`,
      cc: options.cc ? (Array.isArray(options.cc) ? options.cc.join(', ') : options.cc) : undefined,
      bcc: options.bcc ? (Array.isArray(options.bcc) ? options.bcc.join(', ') : options.bcc) : undefined,
    };

    const info = await this.transporter.sendMail(mailOptions);

    return {
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
    };
  }

  async sendBulkEmails(options: SendEmailOptions[]): Promise<EmailResult[]> {
    const results: EmailResult[] = [];

    for (const option of options) {
      const result = await this.sendEmail(option);
      results.push(result);
    }

    return results;
  }
}
