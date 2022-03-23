import { mockAddAccountRepository } from '@/tests/data/mocks/db-account.mock';
import { mockAccountModel } from '@/tests/domain/mocks/account.mock';
import { throwError } from '@/tests/domain/mocks/test.helpers';
import { DbAddAccount } from '@/data/usecases/account/db-add-account';
import { AddAccountRepository } from '@/data';

const mockAddAccountParams = () => ({
  name: 'any_name',
  email: 'any_email',
  password: 'any_password',
});

type SutTypes = {
  sut: DbAddAccount,
  addAccountRepositoryStub: AddAccountRepository,
};

const makeSut = (): SutTypes => {
  const addAccountRepositoryStub = mockAddAccountRepository();

  const sut = new DbAddAccount(addAccountRepositoryStub);
  return {
    sut,
    addAccountRepositoryStub,
  };
};

describe('DbAddAccount Usecase', () => {
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
    const { sut, addAccountRepositoryStub } = makeSut();
    jest.spyOn(addAccountRepositoryStub, 'findByEmail').mockReturnValue(Promise.resolve(mockAccountModel()));
    const response = await sut.add(mockAddAccountParams());
    expect(response).toBeFalsy();
  });

  it('should return an account on success', async () => {
    const { sut } = makeSut();
    const account = await sut.add(mockAddAccountParams());
    expect(account).toEqual(mockAccountModel());
  });
});