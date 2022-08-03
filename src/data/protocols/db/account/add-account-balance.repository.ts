export namespace UpdateAccountBalanceRepository {
  export type Params = { accountId: string, balance: number };
  export type Result = {
    newBalance: number
  };
}

export interface UpdateAccountBalanceRepository {
  updateBalance({ accountId, balance }: UpdateAccountBalanceRepository.Params): Promise<UpdateAccountBalanceRepository.Result>;
}
