import { Provider } from '@prisma/client';
import { AddAccount } from '@/domain/usecases/account/add-account';
import { MissingParamsError } from '@/presentation/errors/missing-params.error';
import { success } from '@/presentation/helpers/http.helpers';
import { mockAddAccount } from '@/tests/presentation/mocks/account.mock';
import { SignUpController } from '@/presentation/controller/account';
import { RenewAccountChallenges } from '@/domain/usecases/challenge';

type SutTypes = {
  sut: SignUpController,
  addAccountStub: AddAccount,
  renewAccountChallenges: RenewAccountChallenges
};

const makeSut = (): SutTypes => {
  const addAccountStub = mockAddAccount();
  const renewAccountChallenges = {
    renew: jest.fn(async () => Promise.resolve({
      challenges: [{
        id: 'any_id',
      }],
    })),
  };

  const sut = new SignUpController(addAccountStub, renewAccountChallenges);
  return {
    sut,
    addAccountStub,
    renewAccountChallenges,
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

  it('should call renewAccountChallenges with correct values if created is true', async () => {
    const { sut, renewAccountChallenges } = makeSut();
    const request = {
      email: 'any_email',
      name: 'any_name',
      password: 'any_password',
      provider: 'credentials' as Provider,
    };

    const httpResponse = await sut.handle(request);
    expect(renewAccountChallenges.renew).toBeCalledWith({
      accountId: 'any_id',
      periodicity: 'daily',
    });
    expect(renewAccountChallenges.renew).toBeCalledWith({
      accountId: 'any_id',
      periodicity: 'weekly',
    });
    expect(httpResponse).toEqual(success({
      id: 'any_id',
      created: true,
    }));
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
