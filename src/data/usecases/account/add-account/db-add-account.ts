import {
  AccountModel, AddAccount, AddAccountParams, AddAccountRepository,
} from './db-add-account.protocols';

export class DbAddAccount implements AddAccount {
  constructor(private readonly addAccountRepository: AddAccountRepository) {}

  async add(data: AddAccountParams): Promise<AccountModel> {
    return this.addAccountRepository.add(data);
  }
}
