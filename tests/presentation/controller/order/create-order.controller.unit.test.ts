import { CreateOrder } from '@/domain/usecases/order';
import { makeCreateOrderParams } from '@/tests/domain/mocks/order.mock';
import { CreateOrderController } from '@/presentation/controller/order/';
import {
  success,
} from '@/presentation/helpers/http.helpers';
import { MissingParamsError, NotFound } from '@/presentation/errors';
import { GetAccountById } from '@/domain/usecases/account';
import { ListBusinessById } from '@/domain/usecases/business';
import { EmailVerificationSender } from '@/data/protocols/email/email-verification-sender';
import { InvalidParamsError } from '@/presentation/errors/invalid-params.error';

describe('CreateOrderController', () => {
  const order = makeCreateOrderParams();
  delete order.sellerId;

  let sut: CreateOrderController;
  let createOrder: CreateOrder;
  let getAccountById: GetAccountById;
  let listBusinessById: ListBusinessById;
  let emailVerificationSender: EmailVerificationSender;

  const baseCreatePayload = {
    description: 'test',
    paymentMethod: 'CreditCard' as 'CreditCard',
    change: 0,
    total: 10,
    latitude: 10,
    longitude: 10,
    couponId: 'any_id',
  };

  beforeAll(() => {
    createOrder = {
      create: jest.fn(async () => Promise.resolve({ orderId: 'any_id' })),
    };

    getAccountById = {
      getById: jest.fn(async () => Promise.resolve({
        email: 'any_email', name: 'any_name', id: 'any_id', verified: false, provider: 'credentials', balance: 10,
      })),
    };

    listBusinessById = {
      list: jest.fn(async () => Promise.resolve({
        id: 'any_id',
        name: 'any_name',
        description: 'any_description',
        accountId: 'any_account_id',
        imageUrl: 'any_image_url',
        latitude: 'any_latitude',
        longitude: 'any_longitude',
        street: 'any_street',
        city: 'any_city',
        state: 'any_state',
        zip: 'any_zip',
        country: 'any_country',
        maxPermittedCouponPercentage: 10,
      })),
    };

    emailVerificationSender = {
      send: jest.fn(async () => Promise.resolve(true)),
    };

    sut = new CreateOrderController(createOrder, getAccountById, listBusinessById, emailVerificationSender);
  });

  beforeEach(() => {
    sut = new CreateOrderController(createOrder, getAccountById, listBusinessById, emailVerificationSender);
  });

  it('should call CreateOrder with correct values', async () => {
    await sut.handle(order);

    expect(createOrder.create).toHaveBeenCalledWith(order);
  });

  it('should return order id if order created successfully', async () => {
    const response = await sut.handle(order);

    expect(response).toEqual(success({ orderId: 'any_id' }));
  });

  it('should throw error if CreateOrder throws unhandled error', async () => {
    (createOrder.create as jest.Mock).mockImplementationOnce(async () => Promise.reject(new Error()));
    const response = sut.handle(order);

    await expect(response).rejects.toThrow(new Error());
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
      ...baseCreatePayload,
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
      ...baseCreatePayload,
    },
    missing: ['buyerId'],
  },
  {
    data: {
      businessId: 'any',
      buyerId: 'any',
      items: [{
        quantity: 1,
        productId: 'any_product_id',
      }],
      ...baseCreatePayload,
      total: undefined,
    },
    missing: ['total'],
  },
  {
    data: {
      businessId: 'any',
      buyerId: 'any',
      total: 1,
      items: undefined,
      ...baseCreatePayload,
    },
    missing: ['items'],
  },
  ])('should throw MissingParamsError if missing required params ', async (params) => {
    const response = sut.handle(params.data);

    await expect(response).rejects.toThrow(new MissingParamsError({
      params: params.missing,
    }));
  });

  it('should throw InvalidParamsError if invalid params was provided', async () => {
    (createOrder.create as jest.Mock).mockImplementationOnce(async () => Promise.reject(new InvalidParamsError({
      params: ['total'],
    })));
    const response = sut.handle(order);

    await expect(response).rejects.toThrow(new InvalidParamsError({
      params: ['total'],
    }));
  });

  it('should call emailVerificationSender two times', async () => {
    await sut.handle(order);

    expect(emailVerificationSender.send).toHaveBeenCalledWith({
      message: expect.any(String),
      subject: expect.any(String),
      toEmail: 'any_email',
    });
    expect(emailVerificationSender.send).toHaveBeenCalledWith({
      message: expect.any(String),
      subject: expect.any(String),
      toEmail: 'any_email',
    });

    expect(emailVerificationSender.send).toHaveBeenCalledTimes(2);
  });

  it('should call getAccountById with correct params two times', async () => {
    await sut.handle(order);

    expect(getAccountById.getById).toHaveBeenCalledWith({
      accountId: 'any_id',
    });
    expect(getAccountById.getById).toHaveBeenCalledTimes(2);
  });

  it('should call listBusinessById with correct params', async () => {
    await sut.handle(order);

    expect(listBusinessById.list).toHaveBeenCalledWith({
      businessId: 'any_id',
    });
  });

  it('should return notFound if any entity was not found', async () => {
    (getAccountById.getById as jest.Mock).mockImplementationOnce(async () => Promise.reject(new NotFound({ entity: 'Account' })));
    const response = sut.handle(order);

    await expect(response).rejects.toThrow(new NotFound({ entity: 'Account' }));
  });

  it('should return badRequest if invalid paymentMethod was provided', async () => {
    const invalidPaymentMethod = {
      ...order,
      paymentMethod: undefined,
    };

    const response = sut.handle(invalidPaymentMethod);

    await expect(response).rejects.toThrow(new InvalidParamsError({
      params: ['paymentMethod'],
    }));
  });
});
