import { GetOrderByIdRepository, UpdateOrderByIdRepository } from '@/data/protocols/db/order';
import { DbChangeOrderStatus } from '@/data/usecases/order';
import { NotFound } from '@/presentation/errors';

describe('DbChangeOrderStatus', () => {
  let sut: DbChangeOrderStatus;
  let getOrderByIdRepository: GetOrderByIdRepository;
  let updateOrderByIdRepository: UpdateOrderByIdRepository;

  beforeAll(() => {
    getOrderByIdRepository = {
      getOrderById: jest.fn(async () => Promise.resolve({
        id: 'any-id',
        businessId: 'string',
        buyerId: 'string',
        total: 100,
        items: [],
        status: 'PENDING',
      })),
    };

    updateOrderByIdRepository = {
      updateOrderById: jest.fn(async () => Promise.resolve({
        orderId: 'any-id',
        status: 'CANCELED',
        total: 100,
      })),
    };
  });

  beforeEach(() => {
    sut = new DbChangeOrderStatus(getOrderByIdRepository, updateOrderByIdRepository);
  });

  it('should call ChangeOrderStatusRepository and updateOrderByIdRepository with correct values', async () => {
    const orderId = 'any_id';
    const status = 'COMPLETED';
    await sut.changeOrderStatus({ orderId, status });
    expect(getOrderByIdRepository.getOrderById).toHaveBeenCalledWith({
      orderId,
    });

    expect(updateOrderByIdRepository.updateOrderById).toHaveBeenCalledWith({
      orderId,
      status,
    });
  });

  it('should return orderId and status if called successfully', async () => {
    (updateOrderByIdRepository.updateOrderById as jest.Mock).mockImplementationOnce(() => Promise.resolve({
      orderId: 'any-id',
      status: 'COMPLETED',
    }));
    const orderId = 'any-id';
    const status = 'COMPLETED';
    const order = await sut.changeOrderStatus({ orderId, status });
    expect(order).toEqual({
      orderId: 'any-id',
      status: 'COMPLETED',
    });
  });

  it('should throw notFound error if order not found', async () => {
    (getOrderByIdRepository.getOrderById as jest.Mock).mockImplementationOnce(() => Promise.resolve(undefined));
    const orderId = 'any-id';
    const status = 'COMPLETED';
    await expect(sut.changeOrderStatus({ orderId, status })).rejects.toThrow(new NotFound({
      entity: 'Order',
    }));
  });

  it('should throw error if updateOrderByIdRepository throws', async () => {
    (updateOrderByIdRepository.updateOrderById as jest.Mock).mockImplementationOnce(() => Promise.reject(new Error()));
    const orderId = 'any-id';
    const status = 'COMPLETED';
    await expect(sut.changeOrderStatus({ orderId, status })).rejects.toThrow();
  });
});
