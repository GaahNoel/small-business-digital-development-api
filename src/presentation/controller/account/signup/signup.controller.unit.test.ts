import { AddAccount } from '@/domain/usecases/account/add-account';
import { MissingParamsError } from '@/presentation/errors/missing-params.error';
import { badRequest } from '@/presentation/helpers/http.helpers';
import { mockAddAccount } from '@/presentation/test/account.mock';
import { SignUpController } from './signup.controller';

type SutTypes = {
  sut: SignUpController,
  addAccountStub: AddAccount,
};

const makeSut = (): SutTypes => {
  const addAccountStub = mockAddAccount();
  const sut = new SignUpController(addAccountStub);
  return {
    sut,
    addAccountStub
  };
};

describe('SignUpController', () => {
  it('should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut();
    const addSpy = jest.spyOn(addAccountStub, 'add');
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
      }
    };
    await sut.handle(httpRequest);
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password'
    });
  });

  it('should return bad request if required params are not provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'any_email',
        password: 'any_password',
      }
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamsError()));
  });
});
