import { AccountModel } from '@/domain/models/account';

export type AddAccountParams = {
  name: string;
  email: string;
  password?: string;
};

export interface AddAccount {
  add(addAccountParams: AddAccountParams): Promise<AccountModel>;
}

export namespace AddAccount {
  export type Params = AddAccountParams;
  export type Result = AccountModel;
}
