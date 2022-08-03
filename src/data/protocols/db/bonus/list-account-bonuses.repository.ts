import { BonusMeasure, BonusStatus, BonusType } from '@/domain/models/bonus';

export namespace ListAccountBonusRepository {
  export type Params = {
    accountId?: string;
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

export interface ListAccountBonusRepository {
  listAccountBonuses(params: ListAccountBonusRepository.Params): Promise<ListAccountBonusRepository.Result>;
}
