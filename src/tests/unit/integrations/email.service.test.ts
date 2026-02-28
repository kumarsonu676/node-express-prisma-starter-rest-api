import { SmtpEmailService } from '../../../integrations/notification/smtp.adapter';
import * as nodemailer from 'nodemailer';

jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn(),
  }),
}));

jest.mock('../../../config/app.config', () => ({
  __esModule: true,
  default: {
    smtp: {
      host: 'smtp.test.com',
      port: 587,
      username: 'testuser',
      password: 'testpass',
    },
    email: {
      fromName: 'Test App',
      fromEmail: 'noreply@test.com',
      replyToName: 'Support',
      replyToEmail: 'support@test.com',
    },
  },
}));

describe('SmtpEmailService', () => {
  let emailService: SmtpEmailService;
  let mockSendMail: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    emailService = new SmtpEmailService();
    mockSendMail = (nodemailer.createTransport as jest.Mock).mock.results[0].value.sendMail;
  });

  describe('sendEmail', () => {
    it('should send email with correct options', async () => {
      mockSendMail.mockResolvedValue({
        messageId: 'test-message-id',
        accepted: ['to@example.com'],
        rejected: [],
      });

      const result = await emailService.sendEmail({
        to: 'to@example.com',
        subject: 'Test Subject',
        body: 'Test body',
        html: '<p>Test body</p>',
      });

      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'to@example.com',
          subject: 'Test Subject',
          text: 'Test body',
          html: '<p>Test body</p>',
          from: 'Test App <noreply@test.com>',
          replyTo: 'Support <support@test.com>',
        })
      );

      expect(result.messageId).toBe('test-message-id');
      expect(result.accepted).toContain('to@example.com');
      expect(result.rejected).toHaveLength(0);
    });

    it('should send email to multiple recipients', async () => {
      mockSendMail.mockResolvedValue({
        messageId: 'test-message-id',
        accepted: ['a@test.com', 'b@test.com'],
        rejected: [],
      });

      const result = await emailService.sendEmail({
        to: ['a@test.com', 'b@test.com'],
        subject: 'Test Subject',
        body: 'Test body',
      });

      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'a@test.com, b@test.com',
        })
      );

      expect(result.accepted).toHaveLength(2);
    });

    it('should use custom from address when provided', async () => {
      mockSendMail.mockResolvedValue({
        messageId: 'test-message-id',
        accepted: ['to@test.com'],
        rejected: [],
      });

      await emailService.sendEmail({
        to: 'to@test.com',
        subject: 'Test',
        body: 'Test body',
        from: 'Custom <custom@test.com>',
      });

      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          from: 'Custom <custom@test.com>',
        })
      );
    });

    it('should handle cc and bcc recipients', async () => {
      mockSendMail.mockResolvedValue({
        messageId: 'test-message-id',
        accepted: ['to@test.com', 'cc@test.com', 'bcc@test.com'],
        rejected: [],
      });

      await emailService.sendEmail({
        to: 'to@test.com',
        subject: 'Test',
        body: 'Test body',
        cc: 'cc@test.com',
        bcc: 'bcc@test.com',
      });

      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          cc: 'cc@test.com',
          bcc: 'bcc@test.com',
        })
      );
    });

    it('should throw error when sendMail fails', async () => {
      mockSendMail.mockRejectedValue(new Error('SMTP error'));

      await expect(
        emailService.sendEmail({
          to: 'to@test.com',
          subject: 'Test',
          body: 'Test body',
        })
      ).rejects.toThrow('SMTP error');
    });
  });

  describe('sendBulkEmails', () => {
    it('should send multiple emails', async () => {
      mockSendMail
        .mockResolvedValueOnce({ messageId: '1', accepted: ['a@test.com'], rejected: [] })
        .mockResolvedValueOnce({ messageId: '2', accepted: ['b@test.com'], rejected: [] });

      const results = await emailService.sendBulkEmails([
        { to: 'a@test.com', subject: 'Test 1', body: 'Body 1' },
        { to: 'b@test.com', subject: 'Test 2', body: 'Body 2' },
      ]);

      expect(results).toHaveLength(2);
      expect(mockSendMail).toHaveBeenCalledTimes(2);
    });

    it('should return empty array when no emails provided', async () => {
      const results = await emailService.sendBulkEmails([]);

      expect(results).toHaveLength(0);
      expect(mockSendMail).not.toHaveBeenCalled();
    });
  });
});
