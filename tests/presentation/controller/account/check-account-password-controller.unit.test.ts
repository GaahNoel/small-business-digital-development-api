import { CheckAccountPassword } from '@/domain/usecases/account/check-account-password';
import { CheckAccountPasswordController } from '@/presentation/controller/account/check-account-password.controller';
import { NotFound } from '@/presentation/errors';
import { MissingParamsError } from '@/presentation/errors/missing-params.error';
import {
  success,
} from '@/presentation/helpers/http.helpers';

const fakeValidRequest = {
  email: 'fake@email.com',
  password: 'fake-password',
};

describe('CheckAccountPasswordController', () => {
  let sut: CheckAccountPasswordController;
  let checkAccountPassword: CheckAccountPassword;

  beforeEach(() => {
    checkAccountPassword = {
      check: jest.fn(async () => ({ id: 'any_id', match: true, verified: true })),
    };

    sut = new CheckAccountPasswordController(checkAccountPassword);
  });
  it('should call CheckAccountPassword with correct values', async () => {
    await sut.handle(fakeValidRequest);

    expect(checkAccountPassword.check).toHaveBeenCalledWith(fakeValidRequest);
  });

  it('should sut return success with match true if called with right params', async () => {
    const response = await sut.handle(fakeValidRequest);

    expect(response).toEqual(success({
      match: true,
      id: 'any_id',
      verified: true,
    }));
  });

  it('should sut return success with match false if called with right params', async () => {
    jest.spyOn(checkAccountPassword, 'check').mockReturnValueOnce(Promise.resolve({ match: false, id: null, verified: false }));

    const response = await sut.handle(fakeValidRequest);

    expect(response).toEqual(success({
      match: false,
      id: null,
      verified: false,
    }));
  });

  it('should return bad request if password was not provided', async () => {
    const fakeInvalidValidRequest = {
      email: 'fake@email.com',
      password: undefined,
    };

    const response = sut.handle(fakeInvalidValidRequest);

    await expect(response).rejects.toThrow(new MissingParamsError({
      params: ['password'],
    }));
  });

  it('should return bad request if email was not provided', async () => {
    const fakeInvalidValidRequest = {
      email: undefined,
      password: 'fake-password',
    };

    const response = sut.handle(fakeInvalidValidRequest);

    await expect(response).rejects.toThrow(new MissingParamsError({
      params: ['email'],
    }));
  });

  it('should return internalServerError if CheckAccountPassword throws', async () => {
    jest.spyOn(checkAccountPassword, 'check').mockReturnValueOnce(Promise.reject(new Error()));
    const response = sut.handle(fakeValidRequest);

    await expect(response).rejects.toThrow(new Error());
  });

  it('should return notFound if checkAccountPassword throws NotFound error', async () => {
    jest.spyOn(checkAccountPassword, 'check').mockReturnValueOnce(Promise.reject(new NotFound({
      entity: 'Account',
    })));
    const response = sut.handle(fakeValidRequest);

    await expect(response).rejects.toThrow(new NotFound({
      entity: 'Account',
    }));
  });
});
