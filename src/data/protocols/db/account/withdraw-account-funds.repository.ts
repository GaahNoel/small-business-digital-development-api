export namespace WithdrawAccountFundsRepository {
  export type Params = {
    accountId: string,
    amount: number
  };
  export type Result = void;
}

export interface WithdrawAccountFundsRepository {
  withdrawAccountFunds(params: WithdrawAccountFundsRepository.Params): Promise<WithdrawAccountFundsRepository.Result>;
}
