import { ListBusinessFromAccount } from '@/domain/usecases/business';
import { internalServerError, success } from '@/presentation/helpers/http.helpers';
import { ListBusinessFromAccountController } from '@/presentation/controller/business';

describe('ListBusinessFromAccountController', () => {
  let sut: ListBusinessFromAccountController;
  let listBusinessFromAccount: ListBusinessFromAccount;

  beforeEach(async () => {
    listBusinessFromAccount = {
      list: jest.fn(async () => Promise.resolve([
        {
          id: 'any_id',
          name: 'any_name',
          description: 'any_description',
          imageUrl: 'any_imageUrl',
        },
      ])),
    };

    sut = new ListBusinessFromAccountController(listBusinessFromAccount);
  });

  it('should call ListBusinessFromAccount with correct values', async () => {
    await sut.handle({
      accountId: 'any-accountId',
    });

    expect(listBusinessFromAccount.list).toHaveBeenCalledWith({
      accountId: 'any-accountId',
    });
  });

  it('should return success if executed successfully', async () => {
    const response = await sut.handle({
      accountId: 'any-accountId',
    });

    expect(response).toEqual(success([{
      id: 'any_id',
      name: 'any_name',
      description: 'any_description',
      imageUrl: 'any_imageUrl',
    }]));
  });

  it('should return internal server error if ListBusinessFromAccount throws', async () => {
    listBusinessFromAccount.list = jest.fn(async () => Promise.reject(new Error()));
    const response = await sut.handle({
      accountId: 'any-accountId',
    });

    expect(response).toEqual(internalServerError(new Error()));
  });
});
