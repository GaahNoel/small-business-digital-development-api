import {
  AccountModel, AddAccount, AddAccountParams, AddAccountRepository
} from './db-add-account.protocols';

export class DbAddAccount implements AddAccount {
  constructor(private readonly addAccountRepository: AddAccountRepository) {}

  add = async (data: AddAccountParams): Promise<AccountModel> => this.addAccountRepository.add(data);
}
