import { Provider } from '@prisma/client';
import { AddAccount } from '@/domain/usecases/account/add-account';
import { MissingParamsError } from '@/presentation/errors/missing-params.error';
import { success } from '@/presentation/helpers/http.helpers';
import { mockAddAccount } from '@/tests/presentation/mocks/account.mock';
import { SignUpController } from '@/presentation/controller/account';

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
      provider: 'credentials' as Provider,
    };
    await sut.handle(request);
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
      provider: 'credentials' as Provider,
    });
  });

  it('should return bad request if name is not provided', async () => {
    const { sut } = makeSut();
    const request = {
      email: 'any_email',
      name: undefined,
      password: 'any_password',
      provider: 'credentials' as Provider,
    };

    const httpResponse = sut.handle(request);
    await expect(httpResponse).rejects.toThrow(new MissingParamsError({
      params: ['name'],
    }));
  });

  it('should return bad request if email is not provided', async () => {
    const { sut } = makeSut();
    const request = {
      email: undefined,
      name: 'any_name',
      password: 'any_password',
      provider: 'credentials' as Provider,
    };

    const httpResponse = sut.handle(request);
    await expect(httpResponse).rejects.toThrow(new MissingParamsError({
      params: ['email'],
    }));
  });

  it('should return bad request if is credentials and password is not provided', async () => {
    const { sut } = makeSut();
    const request = {
      email: 'any_email',
      name: 'any_name',
      password: undefined,
      provider: 'credentials' as Provider,
    };

    const httpResponse = sut.handle(request);
    await expect(httpResponse).rejects.toThrow(new MissingParamsError({
      params: ['password'],
    }));
  });

  it('should return response status success if receive correct params', async () => {
    const { sut } = makeSut();
    const request = {
      email: 'any_email',
      name: 'any_name',
      password: 'any_password',
      provider: 'credentials' as Provider,
    };

    const httpResponse = await sut.handle(request);
    expect(httpResponse).toEqual(success({
      id: 'any_id',
      created: true,
    }));
  });

  it('should return response status success if receive correct params and no password', async () => {
    const { sut } = makeSut();
    const request = {
      email: 'any_email',
      name: 'any_name',
      provider: 'google' as Provider,
    };

    const httpResponse = await sut.handle(request);
    expect(httpResponse).toEqual(success({
      id: 'any_id',
      created: expect.any(Boolean),
    }));
  });

  it('should throw error if addAccount throw an error', async () => {
    const { sut, addAccountStub } = makeSut();
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => Promise.reject(new Error()));
    const request = {
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
      provider: 'credentials' as Provider,
    };

    const httpResponse = sut.handle(request);
    await expect(httpResponse).rejects.toThrow(new Error());
  });
});
