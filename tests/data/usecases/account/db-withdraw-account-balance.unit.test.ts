import { GetAccountByIdRepository } from '@/data';
import { UpdateAccountBalanceRepository, WithdrawAccountBalanceRepository } from '@/data/protocols/db/account/';
import { DbWithdrawAccountBalance } from '@/data/usecases/account';
import { InvalidParamsError } from '@/presentation/errors/invalid-params.error';

describe('DbWithdrawAccountBalance', () => {
  let sut: DbWithdrawAccountBalance;
  let updateAccountBalanceRepository: UpdateAccountBalanceRepository;
  let getAccountByIdRepository: GetAccountByIdRepository;

  beforeAll(() => {
    updateAccountBalanceRepository = {
      updateBalance: jest.fn(async () => Promise.resolve({
        newBalance: 0,
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
    sut = new DbWithdrawAccountBalance(getAccountByIdRepository, updateAccountBalanceRepository);
  });

  it('should call getAccountByIdRepository with correct params', async () => {
    const accountId = 'any_account_id';
    await sut.withdraw({ accountId, amount: 100 });
    expect(getAccountByIdRepository.getById).toHaveBeenCalledWith({
      accountId,
    });
  });

  it('should throw invalid params error if amount provided is bigger than account balance', async () => {
    const accountId = 'any_account_id';
    const promise = sut.withdraw({ accountId, amount: 101 });

    await expect(promise).rejects.toThrow(InvalidParamsError);
  });

  it('should call withdrawAccountBalanceRepository with correct params', async () => {
    const accountId = 'any_account_id';
    const amount = 100;
    await sut.withdraw({ accountId, amount });
    expect(updateAccountBalanceRepository.updateBalance).toHaveBeenCalledWith({
      accountId,
      balance: 0,
    });
  });

  it('should throw error if getAccountByIdRepository throws', async () => {
    (getAccountByIdRepository.getById as jest.Mock).mockReturnValueOnce(Promise.reject(new Error()));
    const promise = sut.withdraw({ accountId: 'any_account_id', amount: 100 });

    await expect(promise).rejects.toThrow();
  });
  it('should throw error if withdrawAccountBalanceRepository throws', async () => {
    (updateAccountBalanceRepository.updateBalance as jest.Mock).mockReturnValueOnce(Promise.reject(new Error()));
    const promise = sut.withdraw({ accountId: 'any_account_id', amount: 100 });

    await expect(promise).rejects.toThrow();
  });
});
