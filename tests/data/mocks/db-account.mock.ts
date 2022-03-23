import { AddAccountRepository } from '@/data/protocols/db/account/add-account-repository';
import { AccountModel } from '@/domain/models';
import { AddAccountParams } from '@/domain/usecases';
import { mockAccountModel } from '@/tests/domain/mocks/account.mock';

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
