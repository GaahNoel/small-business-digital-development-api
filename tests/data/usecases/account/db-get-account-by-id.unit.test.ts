import { GetAccountByIdRepository } from '@/data/protocols/db/account/get-account-by-id.repository';
import { DBGetAccountById } from '@/data/usecases/account';
import { NotFound } from '@/presentation/errors';

describe('DbGetAccountById', () => {
  let sut: DBGetAccountById;
  let getAccountByIdRepository: GetAccountByIdRepository;

  beforeAll(() => {
    getAccountByIdRepository = {
      getById: jest.fn(async () => Promise.resolve({
        id: 'valid_id',
        name: 'any_name',
        email: 'email@email.com',
        verified: true,
        provider: 'credentials',
      })),
    };
  });

  beforeEach(() => {
    sut = new DBGetAccountById(getAccountByIdRepository);
  });

  it('should call getAccountByIdRepository with correct params', async () => {
    const accountId = 'any_account_id';
    await sut.getById({ accountId });
    expect(getAccountByIdRepository.getById).toHaveBeenCalledWith({ accountId });
  });

  it('should return account info if called correctly', async () => {
    const accountId = 'any_account_id';
    const account = await sut.getById({ accountId });
    expect(account).toEqual({
      name: 'any_name',
      email: 'email@email.com',
      verified: true,
      provider: 'credentials',
    });
  });

  it('should throw not found error if invalid id was provided', async () => {
    (getAccountByIdRepository.getById as jest.Mock).mockImplementationOnce(async () => Promise.resolve(undefined));
    const accountId = 'invalid_account_id';
    await expect(sut.getById({ accountId })).rejects.toThrow(new NotFound({ entity: 'Account' }));
  });

  it('should throw error if getAccountByIdRepository throws one', async () => {
    (getAccountByIdRepository.getById as jest.Mock).mockImplementationOnce(async () => {
      throw new Error();
    });
    const accountId = 'any_account_id';
    await expect(sut.getById({ accountId })).rejects.toThrow();
  });
});
