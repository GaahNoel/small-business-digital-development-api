import { GetBonusByIdRepository } from '@/data/protocols/db/bonus/get-bonus-by-id.repository';
import { GetBonusById } from '@/domain/usecases/bonus';

export class DbGetBonusById implements GetBonusById {
  constructor(private readonly getBonusByIdRepository: GetBonusByIdRepository) {}

  async getById(params: GetBonusById.Params): Promise<GetBonusById.Result> {
    const bonus = await this.getBonusByIdRepository.getBonusById({
      bonusId: params.bonusId,
    });
    return bonus;
  }
}
