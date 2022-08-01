import { GetAccountByIdRepository } from '@/data';
import { UpdateAccountBalanceRepository } from '@/data/protocols/db/account/add-account-balance.repository';
import { DbAddAccountBalance } from '@/data/usecases/account';

describe('DbAddAccountBalance', () => {
  let sut: DbAddAccountBalance;
  let updateAccountBalanceRepository: UpdateAccountBalanceRepository;
  let getAccountByIdRepository: GetAccountByIdRepository;

  beforeAll(() => {
    updateAccountBalanceRepository = {
      updateBalance: jest.fn(async () => Promise.resolve({
        newBalance: 1,
      })),
    };
    getAccountByIdRepository = {
      getById: jest.fn(async () => Promise.resolve({
        id: 'valid_id',
        name: 'any_name',
        email: 'email@email.com',
        verified: true,
        provider: 'credentials',
        balance: 100,
      })),
    };
  });

  beforeEach(() => {
    sut = new DbAddAccountBalance(getAccountByIdRepository, updateAccountBalanceRepository);
  });

  it('should call UpdateAccountBalanceRepository with correct values and return new account balance', async () => {
    const accountId = 'any_account_id';
    const balance = 1;

    const result = await sut.addBalance({ accountId, balance });

    expect(updateAccountBalanceRepository.updateBalance).toHaveBeenCalledWith({ accountId, balance: 101 });
    expect(result.newBalance).toBe(1);
  });

  it('should throw error if getAccountByIdRepository throws', async () => {
    (getAccountByIdRepository.getById as jest.Mock).mockReturnValueOnce(Promise.reject(new Error()));
    const promise = sut.addBalance({ accountId: 'any_account_id', balance: 100 });

    await expect(promise).rejects.toThrow();
  });
  it('should throw error if withdrawAccountBalanceRepository throws', async () => {
    (updateAccountBalanceRepository.updateBalance as jest.Mock).mockReturnValueOnce(Promise.reject(new Error()));
    const promise = sut.addBalance({ accountId: 'any_account_id', balance: 100 });

    await expect(promise).rejects.toThrow();
  });
});
