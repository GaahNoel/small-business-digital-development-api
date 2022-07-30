import { BonusType } from '@/domain/models/bonus';

export type ListBonusParams = {
  type?: 'client' | 'business'
};

const storeItems = {
  client: 'coupon' as BonusType,
  business: 'highlight' as BonusType,
};

export namespace ListBonus {
  export type Params = ListBonusParams;
  export type Result = Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    duration: number;
    type: BonusType
    percent?: number;
  }>;
  export const storeItemsMap = storeItems;
}

export interface ListBonus {
  listBonus(params: ListBonus.Params): Promise<ListBonus.Result>;
}
