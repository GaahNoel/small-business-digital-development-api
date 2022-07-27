export namespace AddAccountBalance {
  export type Params = { accountId: string, balance: number };
  export type Result = {
    newBalance: number
  };
}
export interface AddAccountBalance {
  addBalance({ accountId, balance }: AddAccountBalance.Params): Promise<AddAccountBalance.Result>;
}
