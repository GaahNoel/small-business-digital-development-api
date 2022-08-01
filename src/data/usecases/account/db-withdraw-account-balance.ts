import { GetAccountByIdRepository, UpdateAccountBalanceRepository, WithdrawAccountBalanceRepository } from '@/data/protocols';
import { WithdrawAccountBalance } from '@/domain/usecases/account/withdraw-account-balance';
import { InvalidParamsError } from '@/presentation/errors/invalid-params.error';

export class DbWithdrawAccountBalance implements WithdrawAccountBalance {
  constructor(private readonly getAccountByIdRepository: GetAccountByIdRepository, private readonly updateAccountBalanceRepository: UpdateAccountBalanceRepository) {}

  async withdraw(params: WithdrawAccountBalance.Params): Promise<WithdrawAccountBalance.Result> {
    const account = await this.getAccountByIdRepository.getById({
      accountId: params.accountId,
    });

    if (account.balance < params.amount) {
      throw new InvalidParamsError({
        params: ['amount'],
        message: 'the provided amount cannot be withdrawn because account balance is lower than it',
      });
    }

    const result = await this.updateAccountBalanceRepository.updateBalance({
      accountId: params.accountId,
      balance: account.balance - params.amount,
    });

    return result;
  }
}
