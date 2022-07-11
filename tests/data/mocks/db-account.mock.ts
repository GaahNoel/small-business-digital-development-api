import { AddAccountRepository, FindAccountByEmailRepository, VerifyAccountRepository } from '@/data/protocols/db/account/';
import { mockAccountModel } from '@/tests/domain/mocks/account.mock';

export const mockAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(data: AddAccountRepository.Params): Promise<AddAccountRepository.Result> {
      const mockedAccountModel = mockAccountModel();
      return Promise.resolve({
        id: mockedAccountModel.id,
      });
    }
  }

  return new AddAccountRepositoryStub();
};

export const mockFindAccountByEmailRepository = (): FindAccountByEmailRepository => {
  class FindAccountByEmailRepositoryStub implements FindAccountByEmailRepository {
    async findByEmail(data: FindAccountByEmailRepository.Params): Promise<FindAccountByEmailRepository.Result> {
      return Promise.resolve(null);
    }
  }

  return new FindAccountByEmailRepositoryStub();
};

export const mockVerifyAccountRepository = (): VerifyAccountRepository => {
  class VerifyAccountRepositoryStub implements VerifyAccountRepository {
    async verify(data: VerifyAccountRepository.Params): Promise<VerifyAccountRepository.Result> {
      return Promise.resolve(true);
    }
  }

  return new VerifyAccountRepositoryStub();
};
