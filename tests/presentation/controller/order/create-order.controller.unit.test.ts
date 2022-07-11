import { CreateOrder } from '@/domain/usecases/order';
import { makeCreateOrderParams } from '@/tests/domain/mocks/order.mock';
import { CreateOrderController } from '@/presentation/controller/order/';
import { badRequest, internalServerError, success } from '@/presentation/helpers/http.helpers';
import { MissingParamsError } from '@/presentation/errors';

describe('CreateOrderController', () => {
  let sut: CreateOrderController;
  let createOrder: CreateOrder;

  beforeAll(() => {
    createOrder = {
      create: jest.fn(async () => Promise.resolve({ orderId: 'any_id' })),
    };
  });

  beforeEach(() => {
    sut = new CreateOrderController(createOrder);
  });

  it('should call CreateOrder with correct values', async () => {
    const order = makeCreateOrderParams();
    sut = new CreateOrderController(createOrder);

    await sut.handle(order);

    expect(createOrder.create).toHaveBeenCalledWith(order);
  });

  it('should return order id if order created successfully', async () => {
    const order = makeCreateOrderParams();
    const response = await sut.handle(order);

    expect(response).toEqual(success({ orderId: 'any_id' }));
  });

  it('should return internal server error if CreateOrder throws unhandled error', async () => {
    (createOrder.create as jest.Mock).mockImplementation(async () => Promise.reject(new Error()));
    const order = makeCreateOrderParams();
    const response = await sut.handle(order);

    expect(response).toEqual(internalServerError(new Error()));
  });

  it.each([{
    data: {
      businessId: undefined,
      buyerId: 'any',
      total: 1,
      items: [{
        quantity: 1,
        productId: 'any_product_id',
      }],
    },
    missing: ['businessId'],
  },
  {
    data: {
      businessId: 'any',
      buyerId: undefined,
      total: 1,
      items: [{
        quantity: 1,
        productId: 'any_product_id',
      }],
    },
    missing: ['buyerId'],
  },
  {
    data: {
      businessId: 'any',
      buyerId: 'any',
      total: undefined,
      items: [{
        quantity: 1,
        productId: 'any_product_id',
      }],
    },
    missing: ['total'],
  },
  {
    data: {
      businessId: 'any',
      buyerId: 'any',
      total: 1,
      items: undefined,
    },
    missing: ['items'],
  },
  ])('should return bad request if missing required params ', async (params) => {
    const response = await sut.handle(params.data);

    expect(response).toEqual(badRequest(new MissingParamsError({
      params: params.missing,
    })));
  });
});
