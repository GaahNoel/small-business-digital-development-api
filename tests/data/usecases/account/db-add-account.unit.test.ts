import { mockAddAccountRepository, mockFindAccountByEmailRepository } from '@/tests/data/mocks/db-account.mock';
import { mockAccountModel } from '@/tests/domain/mocks/account.mock';
import { throwError } from '@/tests/domain/mocks/test.helpers';
import { DbAddAccount } from '@/data/usecases/account/db-add-account';
import { AddAccountRepository } from '@/data';
import { FindAccountByEmailRepository } from '@/data/protocols/db/account/find-account-by-email-repository';

const mockAddAccountParams = () => ({
  name: 'any_name',
  email: 'any_email',
  password: 'any_password',
});

type SutTypes = {
  sut: DbAddAccount,
  addAccountRepositoryStub: AddAccountRepository,
  findAccountByEmailRepositoryStub: FindAccountByEmailRepository,
};

const makeSut = (): SutTypes => {
  const addAccountRepositoryStub = mockAddAccountRepository();

  const findAccountByEmailRepositoryStub = mockFindAccountByEmailRepository();

  const sut = new DbAddAccount(addAccountRepositoryStub, findAccountByEmailRepositoryStub);
  return {
    sut,
    addAccountRepositoryStub,
    findAccountByEmailRepositoryStub,
  };
};

describe('DbAddAccount UseCase', () => {
  it('should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');

    await sut.add(mockAddAccountParams());
    expect(addSpy).toHaveBeenCalledWith(mockAddAccountParams());
  });

  it('should throw if addAccountRepository throws', () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    jest.spyOn(addAccountRepositoryStub, 'add').mockImplementation(throwError);
    const promise = sut.add(mockAddAccountParams());
    expect(promise).rejects.toThrow();
  });

  it('should return null if account already exists', async () => {
    const { sut, findAccountByEmailRepositoryStub } = makeSut();
    jest.spyOn(findAccountByEmailRepositoryStub, 'findByEmail').mockReturnValue(Promise.resolve(mockAccountModel()));
    const response = await sut.add(mockAddAccountParams());
    expect(response).toBeFalsy();
  });

  it('should return an account id on success', async () => {
    const { sut } = makeSut();
    const account = await sut.add(mockAddAccountParams());
    expect(account).toEqual({
      id: mockAccountModel().id,
    });
  });
});
