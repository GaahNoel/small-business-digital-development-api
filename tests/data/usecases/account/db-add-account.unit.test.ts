import { mockAddAccountRepository, mockFindAccountByEmailRepository } from '@/tests/data/mocks/db-account.mock';
import { mockAccountModel } from '@/tests/domain/mocks/account.mock';
import { throwError } from '@/tests/domain/mocks/test.helpers';
import { DbAddAccount } from '@/data/usecases/account';
import { AddAccountRepository } from '@/data';
import { FindAccountByEmailRepository } from '@/data/protocols/db/account';
import { HasherSpy } from '../../mocks/cryptograph.mock';
import { mockEmailVerificationSender } from '../../mocks/email.mock';
import { EmailVerificationSender } from '@/data/protocols/email/email-verification-sender';

type Provider = 'socialMedia' | 'credentials';

const mockAddAccountParams = () => ({
  name: 'any_name',
  email: 'any_email',
  password: 'any_password',
  provider: 'credentials' as Provider,
});

type SutTypes = {
  sut: DbAddAccount,
  addAccountRepositoryStub: AddAccountRepository,
  findAccountByEmailRepository: FindAccountByEmailRepository,
  hasherSpy: HasherSpy,
  emailVerificationSenderStub: EmailVerificationSender,
};
const encrypter = {
  encrypt: jest.fn(async () => Promise.resolve('any_token')),
};

const makeSut = (): SutTypes => {
  const addAccountRepositoryStub = mockAddAccountRepository();
  const findAccountByEmailRepository = {
    findByEmail: jest.fn(async () => Promise.resolve(undefined)),
  };
  const hasherSpy = new HasherSpy();
  const emailVerificationSenderStub = mockEmailVerificationSender();

  const sut = new DbAddAccount(
    addAccountRepositoryStub,
    findAccountByEmailRepository,
    emailVerificationSenderStub,
    hasherSpy,
    encrypter,
  );

  return {
    sut,
    addAccountRepositoryStub,
    findAccountByEmailRepository,
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
      provider: 'credentials' as Provider,
      verified: false,
    });
  });

  it('should call AddAccountRepository with empty password if it was not provided', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');
    const { password, provider, ...mockedAccountWithoutPassword } = mockAddAccountParams();
    await sut.add({
      ...mockedAccountWithoutPassword,
      provider: 'socialMedia' as Provider,
    });
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email',
      password: '',
      provider: 'socialMedia' as Provider,
      verified: true,
    });
  });

  it('should throw if addAccountRepository throws', () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    jest.spyOn(addAccountRepositoryStub, 'add').mockImplementation(throwError);
    const promise = sut.add(mockAddAccountParams());
    expect(promise).rejects.toThrow();
  });

  it('should return account created true if account already exists', async () => {
    const { sut, findAccountByEmailRepository } = makeSut();
    jest.spyOn(findAccountByEmailRepository, 'findByEmail').mockReturnValue(Promise.resolve(mockAccountModel()));
    const response = await sut.add(mockAddAccountParams());
    expect(response).toEqual({
      id: mockAccountModel().id,
      created: false,
    });
  });

  it('should return an account id on success', async () => {
    const { sut } = makeSut();
    const account = await sut.add(mockAddAccountParams());
    expect(account).toEqual({
      id: mockAccountModel().id,
      created: true,
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
  it('should call encrypter with email to send email verification', async () => {
    const { sut } = makeSut();

    await sut.add(mockAddAccountParams());

    expect(encrypter.encrypt).toHaveBeenCalledWith('any_id');
  });

  it('should not send email verification if password was not provided', async () => {
    const { sut, emailVerificationSenderStub } = makeSut();
    const sendEmailSpy = jest.spyOn(emailVerificationSenderStub, 'send');
    const { password, ...accountWithNoPassword } = mockAddAccountParams();

    await sut.add(accountWithNoPassword);

    expect(sendEmailSpy).toHaveBeenCalledTimes(0);
  });
});
