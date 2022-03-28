import { EmailVerifyAccount } from '@/data/usecases/account/email-verify-account';
import { EmailVerification } from '@/data/protocols/email/email-verification';
import { mockEmailVerification } from '../../mocks/email-verification.mock';

type SutTypes = {
  sut: EmailVerifyAccount
  emailVerificationStub: EmailVerification
};

const makeSut = (): SutTypes => {
  const emailVerificationStub = mockEmailVerification();
  const sut = new EmailVerifyAccount(emailVerificationStub);
  return { sut, emailVerificationStub };
};

describe('EmailVerifyAccount UseCase', () => {
  it('should return verified if account was verified successfully', async () => {
    const { sut } = makeSut();
    const result = await sut.verify({ id: 'any_id' });
    expect(result).toEqual({
      verified: true,
    });
  });
});
