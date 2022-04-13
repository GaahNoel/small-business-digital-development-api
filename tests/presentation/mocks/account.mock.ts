import { mockAccountModel } from '@/tests/domain/mocks/account.mock';
import { AddAccount } from '@/domain/usecases/account/add-account';
import { VerifyAccount } from '@/domain/usecases/account/verify-account';

export const mockAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(data: AddAccount.Params): Promise<AddAccount.Result> {
      return Promise.resolve(mockAccountModel());
    }
  }
  return new AddAccountStub();
};

export const mockVerifyAccount = (): VerifyAccount => {
  class VerifyAccountStub implements VerifyAccount {
    async verify(data: VerifyAccount.Params): Promise<VerifyAccount.Result> {
      return Promise.resolve({
        verified: true,
      });
    }
  }
  return new VerifyAccountStub();
};
