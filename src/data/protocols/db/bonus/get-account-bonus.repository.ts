import {
  BonusMeasure, BonusStatus, BonusType,
} from '@/domain/models/bonus';

export namespace GetAccountBonusRepository {
  export type Params = {
    accountId: string,
    type: BonusType
    status?: BonusStatus
  };
  export type Result = Array<{
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
  }>;
}

export interface GetAccountBonusRepository {
  getAccountBonus(params: GetAccountBonusRepository.Params): Promise<GetAccountBonusRepository.Result>;
}
