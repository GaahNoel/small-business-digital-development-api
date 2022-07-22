import { GetOrderByIdRepository } from '@/data/protocols/db/order';
import { GetOrderById } from '@/domain/usecases/order';
import { DbGetOrderById } from '@/data/usecases/order';

describe('GetOrderById', () => {
  let getOrderById: GetOrderById;
  let getOrderByIdRepository: GetOrderByIdRepository;

  beforeAll(() => {
    getOrderByIdRepository = {
      getOrderById: jest.fn(async () => ({
        id: 'any-id',
        businessId: 'string',
        buyerId: 'string',
        total: 100,
        items: [],
        status: 'PENDING' as 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date(),
        description: 'any-description',
        paymentMethod: 'CreditCard' as 'CreditCard',
        change: 10,
        sellerId: 'any-seller-id',
        sellerStatus: 'PENDING' as 'PENDING',
        buyerStatus: 'PENDING' as 'PENDING',
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
      id: 'any-id',
      businessId: 'string',
      buyerId: 'string',
      total: 100,
      items: [],
      status: 'PENDING' as 'PENDING',
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      description: 'any-description',
      paymentMethod: 'CreditCard' as 'CreditCard',
      change: 10,
      sellerId: 'any-seller-id',
      sellerStatus: 'PENDING' as 'PENDING',
      buyerStatus: 'PENDING' as 'PENDING',
    });
  });

  it('should throw if order not found', async () => {
    (getOrderByIdRepository.getOrderById as jest.Mock).mockImplementationOnce(async () => null);
    const orderId = 'any_id';
    await expect(getOrderById.getOrderById({ orderId })).rejects.toThrow();
  });
});
