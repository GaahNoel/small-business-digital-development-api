import { ListAccountOrders } from '@/domain/usecases/order';
import { ListAccountOrdersController } from '@/presentation/controller/order';
import { MissingParamsError } from '@/presentation/errors';
import { badRequest, internalServerError, success } from '@/presentation/helpers/http.helpers';

describe('ListAccountOrdersController', () => {
  const request = {
    accountId: 'any_account_id',
    type: 'buy' as 'buy',
  };

  let sut: ListAccountOrdersController;
  let listAccountOrders: ListAccountOrders;

  beforeAll(() => {
    listAccountOrders = {
      listAccountOrders: jest.fn(async () => Promise.resolve([{
        id: 'any_id',
        status: 'PENDING' as 'PENDING',
        total: 100,
        businessId: 'any_business_id',
        buyerId: 'any_buyer_id',
        sellerId: 'any_seller_id',
        createdAt: new Date('2020-01-01'),
        updatedAt: new Date('2020-01-01'),
        items: [],
      }])),
    };
  });

  beforeEach(() => {
    sut = new ListAccountOrdersController(listAccountOrders);
  });

  it('should call listAccountOrders with correct params', async () => {
    await sut.handle(request);
    expect(listAccountOrders.listAccountOrders).toHaveBeenCalledWith({
      accountId: 'any_account_id',
      type: 'buy',
    });
  });

  it('should return a list of orders on success', async () => {
    const response = await sut.handle(request);

    expect(response).toEqual(success([{
      businessId: 'any_business_id',
      orders: [{
        id: 'any_id',
        status: 'PENDING',
        total: 100,
        createdAt: new Date('2020-01-01'),
        updatedAt: new Date('2020-01-01'),
        items: [],
      }],
    }]));
  });

  it.each([{
    params: {
      accountId: 'any_account_id',
      type: undefined as 'buy',
    },
    missing: ['type'],
  }, {
    params: {
      accountId: undefined,
      type: 'buy' as 'buy',
    },
    missing: ['accountId'],
  }])('should return badRequest if required params are missing', async ({ params, missing }) => {
    const response = await sut.handle(params);
    expect(response).toEqual(badRequest(
      new MissingParamsError({
        params: missing,
      }),
    ));
  });

  it('should return internal server error if throws unhandled error ', async () => {
    (listAccountOrders.listAccountOrders as jest.Mock).mockImplementation(async () => {
      throw new Error();
    });
    const response = await sut.handle(request);
    expect(response).toEqual(internalServerError(new Error()));
  });
});
