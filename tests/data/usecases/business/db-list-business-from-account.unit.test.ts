import { ListBusinessFromAccountRepository } from '@/data/protocols/db/business';
import { DbListBusinessFromAccount } from '@/data/usecases/business';
import { mockListBusinessModel } from '@/tests/domain/mocks/business.mock';

describe('DbListBusinessFromAccount UseCase', () => {
  let sut: DbListBusinessFromAccount;
  let listBusinessFromAccountRepository: ListBusinessFromAccountRepository;

  beforeEach(() => {
    listBusinessFromAccountRepository = {
      list: jest.fn(async () => Promise.resolve([
        {
          id: 'any_id',
          name: 'any_name',
          description: 'any_description',
          imageUrl: 'any_imageUrl',
        },
      ])),
    };

    sut = new DbListBusinessFromAccount(listBusinessFromAccountRepository);
  });
  it('should call ListBusinessFromAccountRepository with correct params', async () => {
    await sut.list({
      accountId: 'any_accountId',
    });

    expect(listBusinessFromAccountRepository.list).toHaveBeenCalledWith({
      accountId: 'any_accountId',
    });
  });

  it('should return account infos if called with correct params', async () => {
    const response = await sut.list({
      accountId: 'any_accountId',
    });

    expect(response).toEqual(mockListBusinessModel());
  });

  it('should throw error if repository throws', async () => {
    listBusinessFromAccountRepository.list = jest.fn(async () => Promise.reject(new Error()));

    const promise = sut.list({
      accountId: 'any_accountId',
    });

    await expect(promise).rejects.toThrow();
  });
});
