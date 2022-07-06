import nodemailer from 'nodemailer';
import { EmailVerificationSender } from '@/data/protocols/email/email-verification-sender';

export class NodeMailerAdapter implements EmailVerificationSender {
  transporter: nodemailer.Transporter;

  constructor(private readonly fromEmail: string, user: string, pass: string, host: string, port: number, secure: boolean) {
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    });
  }

  async send(data: EmailVerificationSender.Params): Promise<EmailVerificationSender.Result> {
    const { message, subject, toEmail } = data;
    await this.transporter.sendMail({
      from: this.fromEmail,
      to: toEmail,
      subject,
      html: message,
    }).finally(() => true);

    return true;
  }
}
