import { GetOrderByIdRepository } from '@/data/protocols/db/order';
import { GetOrderById } from '@/domain/usecases/order';
import { DbGetOrderById } from '@/data/usecases/order';

describe('GetOrderById', () => {
  let getOrderById: GetOrderById;
  let getOrderByIdRepository: GetOrderByIdRepository;

  beforeAll(() => {
    getOrderByIdRepository = {
      getOrderById: jest.fn(async () => ({
        id: 'any_id',
        status: 'PENDING' as 'PENDING',
        total: 100,
        businessId: 'any_business_id',
        buyerId: 'any_buyer_id',
        items: [],
      })),
    };
  });

  beforeEach(() => {
    getOrderById = new DbGetOrderById(getOrderByIdRepository);
  });

  it('should call GetOrderByIdRepository with correct values', async () => {
    const orderId = 'any_id';
    await getOrderById.getOrderById({ orderId });
    expect(getOrderByIdRepository.getOrderById).toHaveBeenCalledWith({
      orderId,
    });
  });

  it('should return a order on success', async () => {
    const orderId = 'any_id';
    const order = await getOrderById.getOrderById({ orderId });
    expect(order).toEqual({
      id: 'any_id',
      status: 'PENDING',
      total: 100,
      businessId: 'any_business_id',
      buyerId: 'any_buyer_id',
      items: [],
    });
  });

  it('should throw if order not found', async () => {
    (getOrderByIdRepository.getOrderById as jest.Mock).mockImplementationOnce(async () => null);
    const orderId = 'any_id';
    await expect(getOrderById.getOrderById({ orderId })).rejects.toThrow();
  });
});
