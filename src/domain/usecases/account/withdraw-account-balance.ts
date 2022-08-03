export namespace WithdrawAccountBalance {
  export type Params = {
    accountId: string;
    amount: number;
  };
  export type Result = {
    newBalance: number,
  };
}

export interface WithdrawAccountBalance {
  withdraw(params: WithdrawAccountBalance.Params):Promise<WithdrawAccountBalance.Result>
}
