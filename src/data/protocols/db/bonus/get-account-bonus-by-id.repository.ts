import {
  BonusMeasure, BonusStatus, BonusType,
} from '@/domain/models/bonus';

export namespace GetAccountBonusByIdRepository {
  export type Params = {
    bonusId: string,
  };
  export type Result = {
    id: string;
    accountId: string;
    bonus: {
      id: string;
      name: string;
      description: string;
      price: number;
      duration: number;
      type: BonusType;
      percent?: number;
    };
    quantity: number;
    status: BonusStatus;
    measure: BonusMeasure;
    value: number;
    createdAt?: Date;
    updatedAt?: Date;
  };
}

export interface GetAccountBonusByIdRepository {
  getAccountBonusById(params: GetAccountBonusByIdRepository.Params): Promise<GetAccountBonusByIdRepository.Result>;
}
