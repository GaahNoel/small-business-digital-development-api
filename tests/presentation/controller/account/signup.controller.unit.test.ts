import { AddAccount } from '@/domain/usecases/account/add-account';
import { MissingParamsError } from '@/presentation/errors/missing-params.error';
import { badRequest, internalServerError, success } from '@/presentation/helpers/http.helpers';
import { mockAddAccount } from '@/tests/presentation/mocks/account.mock';
import { SignUpController } from '@/presentation/controller/account/signup.controller';

type SutTypes = {
  sut: SignUpController,
  addAccountStub: AddAccount,
};

const makeSut = (): SutTypes => {
  const addAccountStub = mockAddAccount();
  const sut = new SignUpController(addAccountStub);
  return {
    sut,
    addAccountStub,
  };
};

describe('SignUpController', () => {
  it('should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut();
    const addSpy = jest.spyOn(addAccountStub, 'add');
    const request = {
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
    };
    await sut.handle(request);
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
    });
  });

  it('should return bad request if required params are not provided', async () => {
    const { sut } = makeSut();
    const request = {
      email: 'any_email',
      name: undefined,
      password: 'any_password',
    };

    const httpResponse = await sut.handle(request);
    expect(httpResponse).toEqual(badRequest(new MissingParamsError()));
  });

  it('should return response status success if receive correct params', async () => {
    const { sut } = makeSut();
    const request = {
      email: 'any_email',
      name: 'any_name',
      password: 'any_password',
    };

    const httpResponse = await sut.handle(request);
    expect(httpResponse).toEqual(success({
      id: 'any_id',
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
    }));
  });

  it('should return response status success if receive correct params and no password', async () => {
    const { sut } = makeSut();
    const request = {
      email: 'any_email',
      name: 'any_name',
    };

    const httpResponse = await sut.handle(request);
    expect(httpResponse).toEqual(success({
      id: 'any_id',
      name: 'any_name',
      email: 'any_email',
      password: expect.anything(),
    }));
  });

  it('should return internal server error if addAccount throw an error', async () => {
    const { sut, addAccountStub } = makeSut();
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => Promise.reject(new Error()));
    const request = {
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
    };

    const httpResponse = await sut.handle(request);
    expect(httpResponse).toEqual(internalServerError(new Error()));
  });
});
