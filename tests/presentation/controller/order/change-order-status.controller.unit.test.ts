import { ChangeOrderStatus } from '@/domain/usecases/order/change-order-status';
import { ChangeOrderStatusController } from '@/presentation/controller/order';
import { InternalServerError, MissingParamsError, NotFound } from '@/presentation/errors';

describe('ChangeOrderStatusController', () => {
  let sut: ChangeOrderStatusController;
  let changeOrderStatus: ChangeOrderStatus;

  beforeAll(() => {
    changeOrderStatus = {
      changeOrderStatus: jest.fn(async () => Promise.resolve({
        orderId: 'any_id',
        status: 'COMPLETED',
        buyerStatus: 'COMPLETED',
        sellerStatus: 'COMPLETED',
      })),
    };
  });

  beforeEach(() => {
    sut = new ChangeOrderStatusController(changeOrderStatus);
  });
  it('should call changeOrderStatus with correct params', async () => {
    await sut.handle({
      orderId: 'any_id',
      status: 'COMPLETED',
      authAccountId: 'any_id',
    });
    expect(changeOrderStatus.changeOrderStatus).toHaveBeenCalledWith({
      orderId: 'any_id',
      status: 'COMPLETED',
      accountId: 'any_id',
    });
  });

  it('should return 200, orderId and status on success on success', async () => {
    const httpResponse = await sut.handle({
      orderId: 'any_id',
      status: 'COMPLETED',
      authAccountId: 'any_id',
    });
    expect(httpResponse).toEqual({
      statusCode: 200,
      body: {
        orderId: 'any_id',
        status: 'COMPLETED',
        buyerStatus: 'COMPLETED',
        sellerStatus: 'COMPLETED',
      },
    });
  });

  it('should throw error if an error occurs', async () => {
    (changeOrderStatus.changeOrderStatus as jest.Mock).mockRejectedValueOnce(new Error('any_error'));

    const httpResponse = sut.handle({
      orderId: 'any_id',
      status: 'COMPLETED',
      authAccountId: 'any_id',
    });
    await expect(httpResponse).rejects.toThrow(new Error('any_error'));
  });

  it('should throw NotFound if order not found', async () => {
    (changeOrderStatus.changeOrderStatus as jest.Mock).mockRejectedValueOnce(new NotFound({
      entity: 'order',
    }));

    const httpResponse = sut.handle({
      orderId: 'any_id',
      status: 'COMPLETED',
      authAccountId: 'any_id',
    });
    await expect(httpResponse).rejects.toThrow(new NotFound({
      entity: 'order',
    }));
  });

  it.each([
    {
      params: {
        orderId: 'any_id',
        status: undefined,
      },
      missing: ['status'],
    },
    {
      params: {
        orderId: undefined,
        status: 'COMPLETED',
      },
      missing: ['orderId'],
    },
  ])('should throw MissingParamsError if missing required params', async ({ params: { orderId, status }, missing }) => {
    const response = sut.handle({
      orderId,
      status,
      authAccountId: 'any_id',
    });

    await expect(response).rejects.toThrow(new MissingParamsError({
      params: missing,
    }));
  });
});
