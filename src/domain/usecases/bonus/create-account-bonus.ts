type CreateAccountBonusParams = {
  bonusId: string;
  quantity: number;
  accountId: string;
  businessId?: string;
};

export namespace CreateAccountBonus {
  export type Params = CreateAccountBonusParams;
  export type Result = {
    accountBonusId: string;
  };
  export const bonusesMeasures = {
    coupon: 'percent',
    highlight: 'priority',
  };
}

export interface CreateAccountBonus {
  createAccountBonus(params: CreateAccountBonus.Params): Promise<CreateAccountBonus.Result>;
}
