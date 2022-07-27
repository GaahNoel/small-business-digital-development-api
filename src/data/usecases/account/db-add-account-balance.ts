import { AddAccountBalanceRepository } from '@/data/protocols/db/account/add-account-balance.repository';
import { AddAccountBalance } from '@/domain/usecases/account/add-account-balance';

export class DbAddAccountBalance implements AddAccountBalance {
  constructor(private readonly addAccountBalanceRepository: AddAccountBalanceRepository) {}

  async addBalance({ accountId, balance }: AddAccountBalance.Params): Promise<AddAccountBalance.Result> {
    const { newBalance } = await this.addAccountBalanceRepository.addBalance({ accountId, balance });

    return {
      newBalance,
    };
  }
}
