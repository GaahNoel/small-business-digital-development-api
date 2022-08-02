import { BonusStatus } from '@/domain/models/bonus';

export namespace ChangeBonusStatusRepository {
  export type Params = {
    accountBonusId: string,
    status: BonusStatus
  };

  export type Result = {
    status: BonusStatus;
  };
}

export interface ChangeBonusStatusRepository {
  changeBonusStatus(params: ChangeBonusStatusRepository.Params): Promise<ChangeBonusStatusRepository.Result>;
}
