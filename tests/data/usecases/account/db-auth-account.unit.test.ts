import { FindAccountByEmailRepository } from '@/data';
import { Decrypter } from '@/data/protocols/cryptography';
import { mockAccountModel } from '@/tests/domain/mocks/account.mock';
import { DbAuthAccount } from '@/data/usecases/account/db-auth-account';

const fakeRequest = {
  token: 'any-token',
};
describe('DbAuthAccount UseCase', () => {
  let sut: DbAuthAccount;
  let decrypter: Decrypter;
  let findAccountByEmailRepository: FindAccountByEmailRepository;

  beforeEach(() => {
    decrypter = {
      decrypt: jest.fn(async () => Promise.resolve(({
        email: 'any-email',
      }) as any)),
    };
    findAccountByEmailRepository = {
      findByEmail: jest.fn(async () => Promise.resolve(mockAccountModel())),
    };
    sut = new DbAuthAccount(findAccountByEmailRepository, decrypter);
  });
  it('should call decrypter with correct params', async () => {
    await sut.auth(fakeRequest);

    expect(decrypter.decrypt).toHaveBeenCalledWith(fakeRequest.token);
  });

  it('should call findAccountByEmailRepository with correct params', async () => {
    await sut.auth(fakeRequest);

    expect(findAccountByEmailRepository.findByEmail).toHaveBeenCalledWith({
      email: 'any-email',
    });
  });

  it('should call return id if called with correct params', async () => {
    const response = await sut.auth(fakeRequest);

    expect(response).toEqual({
      id: 'any_id',
    });
  });

  it('should return null if account not exists', async () => {
    jest.spyOn(findAccountByEmailRepository, 'findByEmail').mockReturnValueOnce(Promise.resolve(null));
    const response = await sut.auth(fakeRequest);

    expect(response).toBe(null);
  });

  it('should throw if findAccountByEmailRepository throws', async () => {
    jest.spyOn(findAccountByEmailRepository, 'findByEmail').mockReturnValueOnce(Promise.reject(new Error()));
    const promise = sut.auth(fakeRequest);

    await expect(promise).rejects.toThrow();
  });

  it('should throw if decrypter throws', async () => {
    jest.spyOn(decrypter, 'decrypt').mockReturnValueOnce(Promise.reject(new Error()));
    const promise = sut.auth(fakeRequest);

    await expect(promise).rejects.toThrow();
  });
});
