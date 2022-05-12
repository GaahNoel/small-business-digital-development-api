import { GetAccountByEmail } from '@/domain/usecases/account';
import { internalServerError, success } from '@/presentation/helpers/http.helpers';
import { GetAccountByEmailController } from '@/presentation/controller/account';

const mockedResponse = {
  id: 'any_id',
  verified: true,
  email: 'any_email',
  name: 'any_name',
  provider: 'credentials' as 'credentials',
};

describe('GetAccountByEmailController', () => {
  let getAccountByEmail: GetAccountByEmail;
  let sut: GetAccountByEmailController;

  beforeAll(() => {
    getAccountByEmail = {
      get: jest.fn(async () => Promise.resolve({
        ...mockedResponse,
      })),
    };
  });

  beforeEach(() => {
    sut = new GetAccountByEmailController(getAccountByEmail);
  });

  it('should call getAccountByEmail with correct params', async () => {
    await sut.handle({
      email: 'any_email',
    });

    expect(getAccountByEmail.get).toHaveBeenCalledWith({ email: 'any_email' });
  });

  it('should return success if account found', async () => {
    const response = await sut.handle({
      email: 'any_email',
    });

    expect(response).toEqual(success({
      ...mockedResponse,
    }));
  });

  it('should return internalServerError if GetAccountByEmail throws', async () => {
    (getAccountByEmail.get as jest.Mock).mockImplementationOnce(async () => Promise.reject(new Error()));

    const response = await sut.handle({
      email: 'any_email',
    });

    expect(response).toEqual(internalServerError(new Error()));
  });
});
