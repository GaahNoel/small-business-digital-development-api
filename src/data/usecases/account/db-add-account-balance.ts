import { GetAccountByIdRepository } from '@/data/protocols';
import { UpdateAccountBalanceRepository } from '@/data/protocols/db/account/add-account-balance.repository';
import { AddAccountBalance } from '@/domain/usecases/account/add-account-balance';

export class DbAddAccountBalance implements AddAccountBalance {
  constructor(private readonly getAccountByIdRepository: GetAccountByIdRepository, private readonly updateAccountBalanceRepository: UpdateAccountBalanceRepository) {}

  async addBalance({ accountId, balance }: AddAccountBalance.Params): Promise<AddAccountBalance.Result> {
    const account = await this.getAccountByIdRepository.getById({
      accountId,
    });
    const { newBalance } = await this.updateAccountBalanceRepository.updateBalance({ accountId, balance: account.balance + balance });

    return {
      newBalance,
    };
  }
}
