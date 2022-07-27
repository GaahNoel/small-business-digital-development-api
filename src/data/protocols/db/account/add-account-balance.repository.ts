export namespace AddAccountBalanceRepository {
  export type Params = { accountId: string, balance: number };
  export type Result = {
    newBalance: number
  };
}

export interface AddAccountBalanceRepository {
  addBalance({ accountId, balance }: AddAccountBalanceRepository.Params): Promise<AddAccountBalanceRepository.Result>;
}
