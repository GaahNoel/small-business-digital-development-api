import { mockAccountModel } from '@/tests/domain/mocks/account.mock';
import { AddAccount } from '@/domain/usecases/account/add-account';

export const mockAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(data: AddAccount.Params): Promise<AddAccount.Result> {
      return Promise.resolve(mockAccountModel());
    }
  }
  return new AddAccountStub();
};
