import {
  AccountModel, AddAccount, AddAccountParams, AddAccountRepository,
} from './db-add-account.protocols';

export class DbAddAccount implements AddAccount {
  constructor(private readonly addAccountRepository: AddAccountRepository) {}

  async add(data: AddAccountParams): Promise<AccountModel> {
    const accountAlreadyExists = await this.addAccountRepository.findByEmail(data.email);

    if (accountAlreadyExists) {
      return null;
    }

    return this.addAccountRepository.add(data);
  }
}
