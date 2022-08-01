import {
  AccountBonus, BonusMeasure, BonusStatus, BonusType,
} from '@/domain/models/bonus';

export namespace GetAccountBonuses {
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
export interface GetAccountBonuses {
  getBonuses(params: GetAccountBonuses.Params): Promise<GetAccountBonuses.Result>;
}
