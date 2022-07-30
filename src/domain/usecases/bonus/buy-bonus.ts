type BuyStoreItemParams = {
  storeItemId: string;
  quantity: number;
  accountId: string;
};

export namespace BuyStoreItem {
  export type Params = BuyStoreItemParams;
  export type Result = {
    accountBonusId: string;
  };
}

export interface BuyStoreItem {
  buyStoreItem(params: BuyStoreItem.Params): Promise<BuyStoreItem.Result>;
}
