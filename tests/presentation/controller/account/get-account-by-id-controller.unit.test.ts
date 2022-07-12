import { GetAccountById } from '@/domain/usecases/account';
import { GetAccountByIdController } from '@/presentation/controller/account';
import { NotFound } from '@/presentation/errors';
import { internalServerError, notFound } from '@/presentation/helpers/http.helpers';

describe('GetAccountByIdController', () => {
  let sut: GetAccountByIdController;
  let getAccountById: GetAccountById;

  beforeAll(() => {
    getAccountById = {
      getById: jest.fn(async () => Promise.resolve({
        name: 'any_name',
        email: 'email@email.com',
        verified: true,
        provider: 'credentials',
      })),
    };
  });

  beforeEach(() => {
    sut = new GetAccountByIdController(getAccountById);
  });

  it('should call GetAccountById with correct values', async () => {
    const httpRequest = {
      accountId: 'any_id',
    };

    await sut.handle(httpRequest);

    expect(getAccountById.getById).toHaveBeenCalledWith({
      accountId: 'any_id',
    });
  });

  it('should return 200 if GetAccountById returns an account', async () => {
    const httpRequest = {
      accountId: 'any_id',
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual({
      statusCode: 200,
      body: {
        name: 'any_name',
        email: 'email@email.com',
        verified: true,
        provider: 'credentials',
      },
    });
  });

  it('should return 404 if GetAccountById returns undefined', async () => {
    (getAccountById.getById as jest.Mock).mockImplementation(async () => Promise.reject(new NotFound({ entity: 'Account' })));

    const httpResponse = await sut.handle({
      accountId: 'any_id',
    });

    expect(httpResponse).toEqual(notFound(new NotFound({ entity: 'Account' })));
  });

  it('should return 500 if GetAccountById throws', async () => {
    (getAccountById.getById as jest.Mock).mockImplementation(async () => Promise.reject(new Error()));

    const httpResponse = await sut.handle({
      accountId: 'any_id',
    });

    expect(httpResponse).toEqual(internalServerError(new Error()));
  });
});
