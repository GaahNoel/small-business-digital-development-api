import { FindAccountByEmailRepository } from '@/data';
import { HashComparer } from '@/data/protocols/cryptography';
import { mockAccountModel } from '@/tests/domain/mocks/account.mock';
import { DbCheckAccountPassword } from '@/data/usecases/account/db-check-account-password';

const fakeData = {
  email: 'any-email',
  password: 'any-password',
};
describe('DbCheckAccountPassword UseCase', () => {
  let sut : DbCheckAccountPassword;
  let findAccountByEmailRepository: FindAccountByEmailRepository;
  let hashComparer: HashComparer;

  beforeEach(() => {
    findAccountByEmailRepository = {
      findByEmail: jest.fn(async () => (Promise.resolve(mockAccountModel()))),
    };
    hashComparer = {
      compare: jest.fn(async () => (Promise.resolve(true))),
    };
    sut = new DbCheckAccountPassword(findAccountByEmailRepository, hashComparer);
  });

  it('should call findAccountByEmailRepository with correct params', async () => {
    await sut.check(fakeData);

    expect(findAccountByEmailRepository.findByEmail).toHaveBeenCalledWith(fakeData);
  });

  it('should call hashComparer with correct params', async () => {
    await sut.check(fakeData);

    expect(hashComparer.compare).toHaveBeenCalledWith(fakeData.password, mockAccountModel().password);
  });
});
