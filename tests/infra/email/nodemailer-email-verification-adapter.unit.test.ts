import { NodeMailerEmailVerification } from '@/infra/email/nodemailer-email-verification';

describe('NodeMailerEmailVerification', () => {
  it('should verify email when receive a user id', () => {
    const sut = new NodeMailerEmailVerification();
    const result = sut.verify({
      id: 'any_id',
    });
    expect(result).toBeTruthy();
  });
});
