import { BonusType } from '@prisma/client';
import { ListBonus } from '@/domain/usecases/bonus';

export namespace ListBonusRepository {
  export type Params = {
    type?: BonusType
  };
  export type Result = ListBonus.Result;
}

export interface ListBonusRepository {
  list(params: ListBonusRepository.Params): Promise<ListBonusRepository.Result>;
}
