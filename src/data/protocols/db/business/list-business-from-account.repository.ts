import { ListBusinessFromAccount } from '@/domain/usecases/business/list-business-from-account';

export interface ListBusinessFromAccountRepository {
  listFromAccount(data:ListBusinessFromAccountRepository.Params): Promise<ListBusinessFromAccountRepository.Result>;
}

export namespace ListBusinessFromAccountRepository {
  export type Params = ListBusinessFromAccount.Params;
  export type Result = ListBusinessFromAccount.Result;
}
