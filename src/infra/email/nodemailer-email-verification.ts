import { EmailVerification } from '@/data/protocols/email/email-verification';

export class NodeMailerEmailVerification implements EmailVerification {
  async verify(id: EmailVerification.Params): Promise<EmailVerification.Result> {
    return {
      verified: true,
    };
  }
}
