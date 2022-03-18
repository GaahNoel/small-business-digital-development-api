import { AddAccountRepository } from '@/data/protocols/db/account/add-account-repository';
import { AccountModel, AddAccountParams } from '@/data/usecases/account/add-account/db-add-account.protocols';
import { mockAccountModel } from '@/domain/test/account.mock';

export const mockAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(data: AddAccountParams): Promise<AccountModel> {
      return Promise.resolve(mockAccountModel());
    }

    async findByEmail(email: string): Promise<AccountModel> {
      return Promise.resolve(null);
    }
  }
  return new AddAccountRepositoryStub();
};
