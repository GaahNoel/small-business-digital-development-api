import { AuthAccount } from '@/domain/usecases/account/auth-account';
import { AuthMiddleware } from '@/presentation/middlewares';
import { AccessDeniedError } from '@/presentation/errors/access-denied.error';
import { forbidden, internalServerError } from '@/presentation/helpers/http.helpers';

describe('AuthMiddleware', () => {
  let sut: AuthMiddleware;
  let authAccount: AuthAccount;

  beforeEach(() => {
    authAccount = {
      auth: jest.fn(async () => ({
        id: 'any_id',
      })),
    };
    sut = new AuthMiddleware(authAccount);
  });

  it('should call authAccount with correct values', async () => {
    const fakeRequest = {
      token: 'any_token',
    };
    await sut.handle(fakeRequest);
    expect(authAccount.auth).toHaveBeenCalledWith({
      token: 'any_token',
    });
  });

  it('should return forbidden access token not received', async () => {
    const fakeRequest = {
      token: null,
    };

    const response = await sut.handle(fakeRequest);

    expect(response).toEqual(forbidden(new AccessDeniedError('Permission Denied')));
  });

  it('should return forbidden if access token not received', async () => {
    const fakeRequest = {
      token: null,
    };

    const response = await sut.handle(fakeRequest);

    expect(response).toEqual(forbidden(new AccessDeniedError('Permission Denied')));
  });

  it('should return forbidden if account not found', async () => {
    jest.spyOn(authAccount, 'auth').mockReturnValueOnce(Promise.resolve(null));

    const fakeRequest = {
      token: 'any-token',
    };

    const response = await sut.handle(fakeRequest);

    expect(response).toEqual(forbidden(new AccessDeniedError('Permission Denied')));
  });

  it('should return internal server error authAccount throws', async () => {
    jest.spyOn(authAccount, 'auth').mockReturnValueOnce(Promise.reject(new Error()));

    const fakeRequest = {
      token: 'any-token',
    };

    const response = await sut.handle(fakeRequest);

    expect(response).toEqual(internalServerError(new Error()));
  });
});
