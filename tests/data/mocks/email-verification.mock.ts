import { EmailVerification } from '@/data/protocols/email/email-verification';

export const mockEmailVerification = (): EmailVerification => {
  class EmailVerificationStub implements EmailVerification {
    async verify(data: EmailVerification.Params): Promise<EmailVerification.Result> {
      return Promise.resolve({
        verified: true,
      });
    }
  }
  return new EmailVerificationStub();
};
