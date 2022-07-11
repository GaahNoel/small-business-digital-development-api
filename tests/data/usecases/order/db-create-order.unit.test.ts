import { CreateOrderRepository } from '@/data/protocols/db/order/create-order.repository';
import { makeCreateOrderParams } from '@/tests/domain/mocks/order.mock';
import { DbCreateOrder } from '@/data/usecases/order';

describe('DbCreateOrder', () => {
  let sut: DbCreateOrder;
  let createOrderRepository: CreateOrderRepository;

  beforeAll(() => {
    createOrderRepository = {
      create: jest.fn(async () => Promise.resolve({
        orderId: 'any_id',
      })),
    };
  });

  beforeEach(() => {
    sut = new DbCreateOrder(createOrderRepository);
  });

  it('should call createOrderRepository with correct params', async () => {
    const order = makeCreateOrderParams();

    await sut.create(order);
    expect(createOrderRepository.create).toHaveBeenCalledWith(order);
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
