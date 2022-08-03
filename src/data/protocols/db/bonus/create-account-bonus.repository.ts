import { BonusMeasure } from '@/domain/models/bonus';

export namespace CreateAccountBonusRepository {
  export type Params = {
    accountId: string,
    bonusId: string,
    quantity: number,
    measure: BonusMeasure,
    value: number,
    businessId?: string,
  };

  export type Result = {
    accountBonusId: string;
  };
}

export interface CreateAccountBonusRepository {
  createAccountBonus(params : CreateAccountBonusRepository.Params): Promise<CreateAccountBonusRepository.Result>;
}
