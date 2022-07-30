import { ListBonusRepository } from '@/data/protocols/db/bonus';
import { ListBonus, ListBonusParams } from '@/domain/usecases/bonus';
import { NotFound } from '@/presentation/errors';

export class DbListBonus implements ListBonus {
  constructor(private readonly listBonusRepository: ListBonusRepository) {}

  async listBonus({ type }: ListBonusParams): Promise<ListBonus.Result> {
    const bonuses = await this.listBonusRepository.list({
      type: ListBonus.storeItemsMap[type],
    });

    if (bonuses.length === 0) {
      throw new NotFound({
        entity: 'bonus',
      });
    }

    return bonuses;
  }
}
