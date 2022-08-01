import { WithdrawAccountBalance } from '@/domain/usecases/account/withdraw-account-balance';

export namespace WithdrawAccountBalanceRepository {
  export type Params = WithdrawAccountBalance.Params;
  export type Result = void;
}

export interface WithdrawAccountBalanceRepository {
  withdraw(params: WithdrawAccountBalanceRepository.Params): Promise<WithdrawAccountBalanceRepository.Result>;
}
