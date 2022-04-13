import { EmailVerifyAccount } from '@/data/usecases/account/email-verify-account';
import { mockVerifyAccountRepository } from '../../mocks/db-account.mock';

const makeSut = () => {
  const mockedVerifyAccountRepository = mockVerifyAccountRepository();
  const sut = new EmailVerifyAccount(mockedVerifyAccountRepository);
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
});
