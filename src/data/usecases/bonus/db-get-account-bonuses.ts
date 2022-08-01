import { GetAccountBonusRepository } from '@/data/protocols/db/bonus/';
import { GetAccountBonuses } from '@/domain/usecases/bonus/';
import { NotFound } from '@/presentation/errors';

export class DbGetAccountBonuses implements GetAccountBonuses {
  constructor(private readonly getAccountBonusRepository: GetAccountBonusRepository) {}

  async getBonuses(params: GetAccountBonuses.Params): Promise<GetAccountBonuses.Result> {
    const status = params.status ? params.status : 'ACTIVE';

    const bonuses = await this.getAccountBonusRepository.getAccountBonus({
      accountId: params.accountId,
      type: params.type,
      status,
    });

    if (bonuses.length === 0) {
      throw new NotFound({
        entity: 'Bonus',
      });
    }

    return bonuses;
  }
}
