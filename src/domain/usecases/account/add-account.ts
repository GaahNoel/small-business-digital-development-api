import { AccountModel } from '../../models/account/account';

export type AddAccountParams = {
  name: string;
  email: string;
  password?: string;
}

export interface AddAccount {
  add(addAccountParams: AddAccountParams): Promise<AccountModel>;
}
