import { AccountModel, AddAccountParams, AddAccountRepository } from "./db-add-account.protocols";

export class DbAddAccount {
  constructor(private addAccountRepository: AddAccountRepository) {}
  
  add = async (data: AddAccountParams): Promise<AccountModel> => {
    return await this.addAccountRepository.add(data);
  }

}