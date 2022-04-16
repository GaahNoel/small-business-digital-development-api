import { mockAddAccountRepository, mockFindAccountByEmailRepository } from '@/tests/data/mocks/db-account.mock';
import { mockAccountModel } from '@/tests/domain/mocks/account.mock';
import { throwError } from '@/tests/domain/mocks/test.helpers';
import { DbAddAccount } from '@/data/usecases/account/db-add-account';
import { AddAccountRepository } from '@/data';
import { FindAccountByEmailRepository } from '@/data/protocols/db/account';
import { HasherSpy } from '../../mocks/cryptograph.mock';
import { mockEmailVerificationSender } from '../../mocks/email.mock';
import { EmailVerificationSender } from '@/data/protocols/email/email-verification-sender';

const mockAddAccountParams = () => ({
  name: 'any_name',
  email: 'any_email',
  password: 'any_password',
});

type SutTypes = {
  sut: DbAddAccount,
  addAccountRepositoryStub: AddAccountRepository,
  findAccountByEmailRepositoryStub: FindAccountByEmailRepository,
  hasherSpy: HasherSpy,
  emailVerificationSenderStub: EmailVerificationSender,
};

const makeSut = (): SutTypes => {
  const addAccountRepositoryStub = mockAddAccountRepository();
  const findAccountByEmailRepositoryStub = mockFindAccountByEmailRepository();
  const hasherSpy = new HasherSpy();
  const emailVerificationSenderStub = mockEmailVerificationSender();

  const sut = new DbAddAccount(
    addAccountRepositoryStub,
    findAccountByEmailRepositoryStub,
    emailVerificationSenderStub,
    hasherSpy,
  );

  return {
    sut,
    addAccountRepositoryStub,
    findAccountByEmailRepositoryStub,
    hasherSpy,
    emailVerificationSenderStub,
  };
};

describe('DbAddAccount UseCase', () => {
  it('should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');

    await sut.add(mockAddAccountParams());
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email',
      password: expect.anything(),
    });
  });

  it('should call AddAccountRepository with empty password if it was not provided', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');
    const { password, ...mockedAccountWithoutPassword } = mockAddAccountParams();
    await sut.add(mockedAccountWithoutPassword);
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email',
      password: '',
    });
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

  it('should hash password if it was provided', async () => {
    const { sut, hasherSpy } = makeSut();
    await sut.add(mockAddAccountParams());
    expect(hasherSpy.plaintext).toBe('any_password');
  });

  it('should send email verification if password was provided', async () => {
    const { sut, emailVerificationSenderStub } = makeSut();
    const sendEmailSpy = jest.spyOn(emailVerificationSenderStub, 'send');

    await sut.add(mockAddAccountParams());

    expect(sendEmailSpy).toHaveBeenCalledTimes(1);
  });

  it('should not send email verification if password was not provided', async () => {
    const { sut, emailVerificationSenderStub } = makeSut();
    const sendEmailSpy = jest.spyOn(emailVerificationSenderStub, 'send');
    const { password, ...accountWithNoPassword } = mockAddAccountParams();

    await sut.add(accountWithNoPassword);

    expect(sendEmailSpy).toHaveBeenCalledTimes(0);
  });
});
