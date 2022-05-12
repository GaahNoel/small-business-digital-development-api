import { FindAccountByEmailRepository } from '@/data';
import { mockAccountModel } from '@/tests/domain/mocks/account.mock';
import { DbGetAccountByEmail } from '@/data/usecases/account';

describe('DbGetAccountByEmail', () => {
  let findAccountRepository: FindAccountByEmailRepository;
  let sut: DbGetAccountByEmail;

  beforeAll(() => {
    findAccountRepository = {
      findByEmail: jest.fn(async () => Promise.resolve(mockAccountModel())),
    };
  });

  beforeEach(() => {
    sut = new DbGetAccountByEmail(findAccountRepository);
  });

  it('should call findAccountRepository with correct params', async () => {
    await sut.get({ email: 'any_email' });

    expect(findAccountRepository.findByEmail).toHaveBeenCalledWith({ email: 'any_email' });
  });

  it('should return an account if found', async () => {
    const { password, ...accountModel } = mockAccountModel();
    const response = await sut.get({ email: 'any_email' });

    expect(response).toEqual(accountModel);
  });

  it('should throw error ir findAccountRepository throws', async () => {
    findAccountRepository.findByEmail = jest.fn(async () => Promise.reject(new Error()));

    const promise = sut.get({ email: 'any_email' });

    await expect(promise).rejects.toThrow();
  });
});
