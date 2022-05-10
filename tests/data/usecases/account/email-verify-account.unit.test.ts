import { EmailVerifyAccount } from '@/data/usecases/account/email-verify-account';
import { mockVerifyAccountRepository } from '../../mocks/db-account.mock';

const decrypter = {
  decrypt: jest.fn(async () => Promise.resolve('any_token')),
};

const makeSut = () => {
  const mockedVerifyAccountRepository = mockVerifyAccountRepository();
  const sut = new EmailVerifyAccount(mockedVerifyAccountRepository, decrypter);
  return {
    sut,
    mockedVerifyAccountRepository,
  };
};
describe('EmailVerifyAccount UseCase', () => {
  it('should verify account if received a valid id', async () => {
    const { sut } = makeSut();
    const response = await sut.verify('valid_id');

    expect(response.verified).toBe(true);
  });

  it('should call decrypter with correct params', async () => {
    const { sut } = makeSut();
    await sut.verify('valid_id');
    expect(decrypter.decrypt).toHaveBeenCalledWith('valid_id');
  });
});
