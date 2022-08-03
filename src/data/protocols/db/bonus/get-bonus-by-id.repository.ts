import { Bonus } from '@/domain/models/bonus';

export namespace GetBonusByIdRepository {
  export type Params = {
    bonusId: string;
  };
  export type Result = Bonus;
}

export interface GetBonusByIdRepository {
  getBonusById(params: GetBonusByIdRepository.Params): Promise<GetBonusByIdRepository.Result>;
}
