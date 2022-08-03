import { CreateOrderRepository } from '@/data/protocols/db/order/create-order.repository';
import { makeCreateOrderParams } from '@/tests/domain/mocks/order.mock';
import { DbCreateOrder } from '@/data/usecases/order';
import { ListBusinessByIdRepository } from '@/data/protocols/db/business/list-business-by-id.repository';
import { InvalidParamsError } from '@/presentation/errors/invalid-params.error';
import { GetProductByIdRepository } from '@/data';
import { GetAccountBonusByIdRepository, ChangeBonusStatusRepository } from '@/data/protocols/db/bonus';

describe('DbCreateOrder', () => {
  let sut: DbCreateOrder;
  let createOrderRepository: CreateOrderRepository;
  let listBusinessByIdRepository: ListBusinessByIdRepository;
  let getProductByIdRepository: GetProductByIdRepository;
  let getAccountBonusByIdRepository: GetAccountBonusByIdRepository;
  let changeBonusStatusRepository : ChangeBonusStatusRepository;

  const mockAccountBonusInfo = {
    id: 'any_id',
    accountId: 'any_account_id',
    status: 'EXPIRED',
    bonus: {
      id: 'any_bonus_id',
      type: 'coupon',
      name: 'any_bonus_name',
      description: 'any_bonus_description',
      price: 10,
      duration: 30,
      percent: 10,
    },
    quantity: 1,
    measure: 'percent',
    value: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeAll(() => {
    createOrderRepository = {
      create: jest.fn(async () => Promise.resolve({
        orderId: 'any_id',
      })),
    };

    listBusinessByIdRepository = {
      listById: jest.fn(async () => Promise.resolve({
        id: 'any_id',
        name: 'any_name',
        description: 'any_description',
        accountId: 'any_account_id',
        imageUrl: 'any_image_url',
        productIds: ['any_product_id'],
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

    getProductByIdRepository = {
      get: jest.fn(async () => Promise.resolve({
        id: 'any_id',
        name: 'any_name',
        type: 'product' as 'product' | 'service',
        description: 'any_description',
        listPrice: 1,
        salePrice: 2,
        imageUrl: 'any_image_url',
        businessId: 'any-id',
        category: {
          id: 'any_category_id',
          name: 'any_category_name',
        },
        createdAt: expect.any(Date),
      })),
    };

    getAccountBonusByIdRepository = {
      getAccountBonusById: jest.fn(async () => Promise.resolve({
        id: 'any_id',
        accountId: 'any_account_id',
        status: 'ACTIVE',
        bonus: {
          id: 'any_bonus_id',
          type: 'coupon',
          name: 'any_bonus_name',
          description: 'any_bonus_description',
          price: 10,
          duration: 30,
          percent: 10,
        },
        quantity: 1,
        measure: 'percent',
        value: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    };

    changeBonusStatusRepository = {
      changeBonusStatus: jest.fn(async () => Promise.resolve({
        status: 'ACTIVE',
      })),
    };
  });

  beforeEach(() => {
    sut = new DbCreateOrder(createOrderRepository, listBusinessByIdRepository, getProductByIdRepository, getAccountBonusByIdRepository, changeBonusStatusRepository);
  });

  it('should call createOrderRepository with correct params', async () => {
    const order = makeCreateOrderParams();

    await sut.create(order);
    expect(createOrderRepository.create).toHaveBeenCalledWith({
      ...order,
      accountBonusId: order.couponId,
    });
  });

  it('should call listBusinessByIdRepository with correct values', async () => {
    const order = makeCreateOrderParams();

    await sut.create(order);
    expect(listBusinessByIdRepository.listById).toHaveBeenCalledWith({ businessId: order.businessId });
  });

  it('should return orderId if order created successfully', async () => {
    const order = makeCreateOrderParams();

    const result = await sut.create(order);

    expect(result).toEqual({
      orderId: 'any_id',
    });
  });

  it('should create order with discount if valid coupon was provided', async () => {
    const order = makeCreateOrderParams();
    order.couponId = 'any_id';
    await sut.create(order);

    delete order.couponId;
    expect(createOrderRepository.create).toHaveBeenCalledWith({
      ...order,
      accountBonusId: 'any_id',
      total: order.total - order.total * 0.1,
    });
  });

  it('should not create order if expired coupon was provided', async () => {
    (getAccountBonusByIdRepository.getAccountBonusById as jest.Mock).mockResolvedValueOnce({
      ...mockAccountBonusInfo,
      createdAt: new Date('2020-01-01'),
      updatedAt: new Date('2020-01-01'),
    });
    const order = makeCreateOrderParams();
    order.couponId = 'any_id';
    const promise = sut.create(order);
    await expect(promise).rejects.toThrow(new InvalidParamsError({
      params: ['couponId'],
    }));
  });
  it('should not create order if expired coupon was provided', async () => {
    (getAccountBonusByIdRepository.getAccountBonusById as jest.Mock).mockResolvedValueOnce({
      ...mockAccountBonusInfo,
      status: 'EXPIRED',
    });
    const order = makeCreateOrderParams();
    order.couponId = 'any_id';
    const promise = sut.create(order);
    await expect(promise).rejects.toThrow(new InvalidParamsError({
      params: ['couponId'],
    }));
  });
  it('should not create order if bonus that is not coupon was provided', async () => {
    (getAccountBonusByIdRepository.getAccountBonusById as jest.Mock).mockResolvedValueOnce({
      ...mockAccountBonusInfo,
      bonus: {
        ...mockAccountBonusInfo.bonus,
        type: 'highlight',
      },
    });
    const order = makeCreateOrderParams();
    order.couponId = 'any_id';
    const promise = sut.create(order);
    await expect(promise).rejects.toThrow(new InvalidParamsError({
      params: ['couponId'],
    }));
  });

  it('should throw error if createOrderRepository throws', async () => {
    (createOrderRepository.create as jest.Mock).mockImplementation(async () => Promise.reject(new Error()));

    const order = makeCreateOrderParams();

    const promise = sut.create(order);

    await expect(promise).rejects.toThrow();
  });

  it('should throw InvalidParamsError if total provided is not equal total of sum of products', async () => {
    const order = makeCreateOrderParams();
    order.total = 3;

    const promise = sut.create(order);

    await expect(promise).rejects.toThrow(InvalidParamsError);
  });
});
