import { AccountModel } from '@/domain/models/account/account';
import { AddAccountParams } from '@/domain/usecases/account/add-account';

export interface AddAccountRepository {
  add(data: AddAccountRepository.Params): Promise<AddAccountRepository.Result>;
}


export namespace AddAccountRepository {
  export type Params = AddAccountParams;
  export type Result = AccountModel;
}
