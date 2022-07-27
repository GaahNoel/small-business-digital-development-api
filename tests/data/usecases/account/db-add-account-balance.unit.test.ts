import { AddAccountBalanceRepository } from '@/data/protocols/db/account/add-account-balance.repository';
import { DbAddAccountBalance } from '@/data/usecases/account';

describe('DbAddAccountBalance', () => {
  let sut: DbAddAccountBalance;
  let addAccountBalance: AddAccountBalanceRepository;

  beforeAll(() => {
    addAccountBalance = {
      addBalance: jest.fn(async () => Promise.resolve({
        newBalance: 1,
      })),
    };
  });

  beforeEach(() => {
    sut = new DbAddAccountBalance(addAccountBalance);
  });

  it('should call AddAccountBalanceRepository with correct values', async () => {
    const accountId = 'any_account_id';
    const balance = 1;

    const result = await sut.addBalance({ accountId, balance });

    expect(addAccountBalance.addBalance).toHaveBeenCalledWith({ accountId, balance });
    expect(result.newBalance).toBe(1);
  });
});
