import { BonusType } from '@/domain/models/bonus';

export namespace CreateBonusRepository {
  export type Params = {
    name: string;
    description: string;
    price: number;
    duration: number;
    type: BonusType;
    percent?: number;
  };
  export type Result = {
    bonusId: string
  };
}

export interface CreateBonusRepository {
  create(params: CreateBonusRepository.Params): Promise<CreateBonusRepository.Result>;
}
