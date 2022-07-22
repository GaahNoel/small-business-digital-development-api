import { GetOrderByIdRepository, UpdateOrderByIdRepository } from '@/data/protocols/db/order';
import { DbChangeOrderStatus } from '@/data/usecases/order';
import { NotFound } from '@/presentation/errors';

describe('DbChangeOrderStatus', () => {
  let sut: DbChangeOrderStatus;
  let getOrderByIdRepository: GetOrderByIdRepository;
  let updateOrderByIdRepository: UpdateOrderByIdRepository;

  const orderId = 'any_id';
  const accountId = 'any_id';

  type OrderStatus = 'PENDING' | 'COMPLETED' | 'CANCELED';

  type GetOrderByIdReturnType = {
    orderStatus?: OrderStatus,
    sellerStatus?: OrderStatus,
    buyerStatus?: OrderStatus
  };

  const getOrderByIdReturn = ({ orderStatus = 'PENDING', sellerStatus = 'PENDING', buyerStatus = 'PENDING' }: GetOrderByIdReturnType) => ({
    id: 'any_id',
    businessId: 'any-business-id',
    buyerId: 'any-buyer-id',
    total: 100,
    items: [],
    status: orderStatus,
    createdAt: new Date(),
    updatedAt: new Date(),
    description: 'any-description',
    paymentMethod: 'CreditCard' as 'CreditCard',
    change: 10,
    sellerId: 'any-seller-id',
    sellerStatus,
    buyerStatus,
  });

  beforeAll(() => {
    getOrderByIdRepository = {
      getOrderById: jest.fn(async () => Promise.resolve(getOrderByIdReturn({}))),
    };

    updateOrderByIdRepository = {
      updateOrderById: jest.fn(async () => Promise.resolve({
        orderId: 'any_id',
        status: 'COMPLETED',
        total: 100,
        buyerStatus: 'PENDING',
        sellerStatus: 'PENDING',
      })),
    };
  });

  beforeEach(() => {
    sut = new DbChangeOrderStatus(getOrderByIdRepository, updateOrderByIdRepository);
  });

  it('should call changeOrderStatus with COMPLETED', async () => {
    (getOrderByIdRepository.getOrderById as jest.Mock).mockImplementationOnce(() => Promise.resolve(
      getOrderByIdReturn({
        sellerStatus: 'COMPLETED',
        buyerStatus: 'PENDING',
      }),
    ));
    const orderStatus = 'COMPLETED' as 'COMPLETED';
    const params = { orderId, accountId: 'any-buyer-id', status: orderStatus };

    const order = await sut.changeOrderStatus(params);

    expect(updateOrderByIdRepository.updateOrderById).toHaveBeenCalledWith({
      orderId,
      status: 'COMPLETED',
      statusType: 'order',
    });
    expect(order.orderId).toBe(orderId);
    expect(order.status).toBe(orderStatus);
  });

  it('should call changeOrderStatus with CANCELED', async () => {
    (getOrderByIdRepository.getOrderById as jest.Mock).mockImplementationOnce(() => Promise.resolve(
      getOrderByIdReturn({
        sellerStatus: 'CANCELED',
        buyerStatus: 'PENDING',
      }),
    ));
    (updateOrderByIdRepository.updateOrderById as jest.Mock).mockImplementationOnce(() => Promise.resolve({
      orderId: 'any_id',
      status: 'CANCELED',
    }));

    const orderStatus = 'COMPLETED' as 'COMPLETED';
    const params = { orderId, accountId: 'any-buyer-id', status: orderStatus };

    const order = await sut.changeOrderStatus(params);

    expect(updateOrderByIdRepository.updateOrderById).toHaveBeenCalledWith({
      orderId,
      status: 'CANCELED',
      statusType: 'order',
    });

    expect(updateOrderByIdRepository.updateOrderById).toHaveBeenCalledWith({
      orderId,
      status: orderStatus,
      statusType: 'buyer',
    });
    expect(order.orderId).toBe(orderId);
    expect(order.status).toBe('CANCELED');
  });

  it('should call changeOrderStatus with PENDING', async () => {
    (getOrderByIdRepository.getOrderById as jest.Mock).mockImplementationOnce(() => Promise.resolve(
      getOrderByIdReturn({
        sellerStatus: 'PENDING',
        buyerStatus: 'PENDING',
      }),
    ));
    (updateOrderByIdRepository.updateOrderById as jest.Mock).mockImplementationOnce(() => Promise.resolve({
      orderId: 'any_id',
      status: 'PENDING',
    }));

    const orderStatus = 'COMPLETED' as 'COMPLETED';
    const params = { orderId, accountId: 'any-buyer-id', status: orderStatus };

    const order = await sut.changeOrderStatus(params);

    expect(updateOrderByIdRepository.updateOrderById).toHaveBeenCalledWith({
      orderId,
      status: 'PENDING',
      statusType: 'order',
    });

    expect(updateOrderByIdRepository.updateOrderById).toHaveBeenCalledWith({
      orderId,
      status: orderStatus,
      statusType: 'buyer',
    });
    expect(order.orderId).toBe(orderId);
    expect(order.status).toBe('PENDING');
  });

  it('should call changeOrderStatus with COMPLETED if seller change status', async () => {
    (getOrderByIdRepository.getOrderById as jest.Mock).mockImplementationOnce(() => Promise.resolve(
      getOrderByIdReturn({
        sellerStatus: 'PENDING',
        buyerStatus: 'COMPLETED',
      }),
    ));
    (updateOrderByIdRepository.updateOrderById as jest.Mock).mockImplementationOnce(() => Promise.resolve({
      orderId: 'any_id',
      status: 'COMPLETED',
    }));

    const orderStatus = 'COMPLETED' as 'COMPLETED';
    const params = { orderId, accountId: 'any-seller-id', status: orderStatus };

    const order = await sut.changeOrderStatus(params);

    expect(updateOrderByIdRepository.updateOrderById).toHaveBeenCalledWith({
      orderId,
      status: 'COMPLETED',
      statusType: 'order',
    });

    expect(updateOrderByIdRepository.updateOrderById).toHaveBeenCalledWith({
      orderId,
      status: orderStatus,
      statusType: 'seller',
    });
    expect(order.orderId).toBe(orderId);
    expect(order.status).toBe('COMPLETED');
  });

  it('should throw notFound error if order not found', async () => {
    (getOrderByIdRepository.getOrderById as jest.Mock).mockImplementationOnce(() => Promise.resolve(undefined));
    const status = 'COMPLETED';
    await expect(sut.changeOrderStatus({ orderId, status, accountId })).rejects.toThrow(new NotFound({
      entity: 'Order',
    }));
  });

  it('should throw error if updateOrderByIdRepository throws', async () => {
    (updateOrderByIdRepository.updateOrderById as jest.Mock).mockImplementationOnce(() => Promise.reject(new Error()));
    const status = 'COMPLETED';
    await expect(sut.changeOrderStatus({ orderId, status, accountId })).rejects.toThrow();
  });
});
