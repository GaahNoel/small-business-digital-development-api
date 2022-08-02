import { GetAccountByIdRepository } from '@/data';
import { ChangeBonusStatusRepository } from '@/data/protocols/db/bonus';
import { GetOrderByIdRepository, UpdateOrderByIdRepository } from '@/data/protocols/db/order';
import { EmailVerificationSender } from '@/data/protocols/email/email-verification-sender';
import { DbChangeOrderStatus } from '@/data/usecases/order';
import { OrderStatus } from '@/domain/models/order';
import { NotFound } from '@/presentation/errors';

describe('DbChangeOrderStatus', () => {
  let sut: DbChangeOrderStatus;
  let getOrderByIdRepository: GetOrderByIdRepository;
  let updateOrderByIdRepository: UpdateOrderByIdRepository;
  let getAccountByIdRepository: GetAccountByIdRepository;
  let emailSender : EmailVerificationSender;
  let changeBonusStatusRepository: ChangeBonusStatusRepository;

  const orderId = 'any_id';
  const accountId = 'any_id';
  const sellerAccountInfo = {
    id: 'valid_id',
    name: 'any_name',
    email: 'email@seller.com',
    verified: true,
    provider: 'credentials',
  };
  const buyerAccountInfo = {
    id: 'valid_id',
    name: 'any_name',
    email: 'email@buyer.com',
    verified: true,
    provider: 'credentials',
  };

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
    latitude: '10',
    longitude: '10',
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
    getAccountByIdRepository = {
      getById: jest.fn(async () => Promise.resolve({
        id: 'valid_id',
        name: 'any_name',
        email: 'email@email.com',
        verified: true,
        provider: 'credentials',
        balance: 10,
      })),
    };

    emailSender = {
      send: jest.fn(async () => Promise.resolve(true)),
    };

    changeBonusStatusRepository = {
      changeBonusStatus: jest.fn(async () => Promise.resolve({
        status: 'ACTIVE',
      })),
    };
  });

  beforeEach(() => {
    sut = new DbChangeOrderStatus(getOrderByIdRepository, updateOrderByIdRepository, getAccountByIdRepository, emailSender, changeBonusStatusRepository);
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

  it('should call changeOrderStatus with CANCELED if any entity set it to canceled', async () => {
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

  it('should call changeOrderStatus with CANCELED if status provided is CANCELED', async () => {
    (getOrderByIdRepository.getOrderById as jest.Mock).mockImplementationOnce(() => Promise.resolve(
      getOrderByIdReturn({
        sellerStatus: 'PENDING',
        buyerStatus: 'PENDING',
      }),
    ));
    (updateOrderByIdRepository.updateOrderById as jest.Mock).mockImplementationOnce(() => Promise.resolve({
      orderId: 'any_id',
      status: 'CANCELED',
    }));

    const orderStatus = 'CANCELED' as 'CANCELED';
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

  it('should call getAccountByIdRepository with correct params', async () => {
    const orderStatus = 'COMPLETED' as 'COMPLETED';
    const params = { orderId, accountId: 'any-buyer-id', status: orderStatus };

    await sut.changeOrderStatus(params);

    expect(getAccountByIdRepository.getById).toHaveBeenCalledWith({
      accountId: 'any-buyer-id',
    });
    expect(getAccountByIdRepository.getById).toHaveBeenCalledWith({
      accountId: 'any-seller-id',
    });
  });

  it('should call email sender', async () => {
    (getAccountByIdRepository.getById as jest.Mock)
      .mockImplementationOnce(() => Promise.resolve(buyerAccountInfo))
      .mockImplementationOnce(() => Promise.resolve(sellerAccountInfo));

    const orderStatus = 'COMPLETED' as 'COMPLETED';
    const params = { orderId, accountId: 'any-buyer-id', status: orderStatus };

    await sut.changeOrderStatus(params);

    expect(emailSender.send).toHaveBeenCalledWith({
      subject: expect.any(String),
      message: expect.any(String),
      toEmail: buyerAccountInfo.email,
    });
    expect(emailSender.send).toHaveBeenCalledWith({
      subject: expect.any(String),
      message: expect.any(String),
      toEmail: sellerAccountInfo.email,
    });
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

  it('should call changeBonusStatusRepository if account has coupon and status was changed to canceled', async () => {
    (getOrderByIdRepository.getOrderById as jest.Mock).mockImplementationOnce(() => Promise.resolve(
      {
        ...getOrderByIdReturn({
          sellerStatus: 'PENDING',
          buyerStatus: 'PENDING',
        }),
        accountBonusId: 'any_id',
      },
    ));
    (updateOrderByIdRepository.updateOrderById as jest.Mock).mockImplementationOnce(() => Promise.resolve({
      orderId: 'any_id',
      status: 'CANCELED',
    }));
    (changeBonusStatusRepository.changeBonusStatus as jest.Mock).mockImplementationOnce(() => Promise.resolve());
    const orderStatus = 'CANCELED' as 'CANCELED';
    const params = { orderId, accountId: 'any-buyer-id', status: orderStatus };

    await sut.changeOrderStatus(params);

    expect(changeBonusStatusRepository.changeBonusStatus).toHaveBeenCalledWith({
      accountBonusId: 'any_id',
      status: 'ACTIVE',
    });
  });
});
