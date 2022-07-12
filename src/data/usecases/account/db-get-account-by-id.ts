import { GetAccountByIdRepository } from '@/data/protocols/db/account';
import { GetAccountById } from '@/domain/usecases/account';
import { NotFound } from '@/presentation/errors';

export class DBGetAccountById implements GetAccountById {
  constructor(private readonly getAccountByIdRepository: GetAccountByIdRepository) {}

  async getById(params: GetAccountById.Params): Promise<GetAccountById.Result> {
    const account = await this.getAccountByIdRepository.getById({
      accountId: params.accountId,
    });

    if (!account) {
      throw new NotFound({
        entity: 'Account',
      });
    }

    return {
      name: account.name,
      email: account.email,
      verified: account.verified,
      provider: account.provider,
    };
  }
}
