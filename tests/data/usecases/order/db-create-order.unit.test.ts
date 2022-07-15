import { CreateOrderRepository } from '@/data/protocols/db/order/create-order.repository';
import { makeCreateOrderParams } from '@/tests/domain/mocks/order.mock';
import { DbCreateOrder } from '@/data/usecases/order';
import { ListBusinessByIdRepository } from '@/data/protocols/db/business/list-business-by-id.repository';

describe('DbCreateOrder', () => {
  let sut: DbCreateOrder;
  let createOrderRepository: CreateOrderRepository;
  let listBusinessByIdRepository: ListBusinessByIdRepository;

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
      })),
    };
  });

  beforeEach(() => {
    sut = new DbCreateOrder(createOrderRepository, listBusinessByIdRepository);
  });

  it('should call createOrderRepository with correct params', async () => {
    const order = makeCreateOrderParams();

    await sut.create(order);
    expect(createOrderRepository.create).toHaveBeenCalledWith(order);
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

  it('should throw error if createOrderRepository throws', async () => {
    (createOrderRepository.create as jest.Mock).mockImplementation(async () => Promise.reject(new Error()));

    const order = makeCreateOrderParams();

    const promise = sut.create(order);

    await expect(promise).rejects.toThrow();
  });
});
