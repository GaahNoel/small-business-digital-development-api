import { BonusType } from '@prisma/client';

export namespace GetBonusById {
  export type Params = {
    bonusId: string;
  };

  export type Result = {
    id: string;
    name: string;
    description: string;
    price: number;
    duration: number;
    type: BonusType;
    percent?: number;
  };
}

export interface GetBonusById {
  getById(params: GetBonusById.Params): Promise<GetBonusById.Result>;
}
