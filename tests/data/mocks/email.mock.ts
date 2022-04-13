import { EmailVerificationSender } from '../protocols/email/email-verification-sender';

export const mockEmailVerificationSender = (): EmailVerificationSender => {
  class EmailVerificationSenderStub implements EmailVerificationSender {
    async send(data: EmailVerificationSender.Params): Promise<EmailVerificationSender.Result> {
      return Promise.resolve(true);
    }
  }

  return new EmailVerificationSenderStub();
};
