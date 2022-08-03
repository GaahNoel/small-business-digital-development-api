import { GetAllAccountIdsRepository } from '@/data/protocols/db/challenge/get-all-account-ids.repository';
import { GetAllAccountIds } from '@/domain/usecases/account/get-all-acount-ids';
import { NotFound } from '@/presentation/errors';

export class DbGetAllAccountIds implements GetAllAccountIds {
  constructor(private readonly getAllAccountIdsRepository: GetAllAccountIdsRepository) {}

  async getAllAccountIds(): Promise<GetAllAccountIds.Result> {
    const { accountIds } = await this.getAllAccountIdsRepository.getAllAccountIds();

    if (accountIds.length === 0) {
      throw new NotFound({
        entity: 'Account',
      });
    }

    return { accountIds };
  }
}
