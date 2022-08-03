import { GetOrderById } from '@/domain/usecases/order';
import { GetOrderByIdController } from '@/presentation/controller/order';
import { MissingParamsError, NotFound } from '@/presentation/errors';

describe('GetOrderByIdController', () => {
  let sut: GetOrderByIdController;
  let getOrderById: GetOrderById;

  beforeAll(() => {
    getOrderById = {
      getOrderById: jest.fn(async () => Promise.resolve({
        id: 'any-id',
        businessId: 'string',
        buyerId: 'string',
        total: 100,
        items: [],
        status: 'PENDING' as 'PENDING',
        createdAt: new Date('2022-02-10'),
        updatedAt: new Date('2022-02-10'),
        description: 'any-description',
        paymentMethod: 'CreditCard' as 'CreditCard',
        change: 10,
        sellerId: 'any-seller-id',
        buyerStatus: 'PENDING',
        sellerStatus: 'PENDING',
        latitude: 10,
        longitude: 10,
      })),
    };
  });
  beforeEach(() => {
    sut = new GetOrderByIdController(getOrderById);
  });

  it('should call GetOrderById with correct params', async () => {
    const orderId = 'any_id';
    await sut.handle({ orderId });
    expect(getOrderById.getOrderById).toHaveBeenCalledWith({ orderId });
  });

  it('should return success if GetOrderById returns a order', async () => {
    const orderId = 'any_id';
    const httpResponse = await sut.handle({ orderId });
    expect(httpResponse).toEqual({
      statusCode: 200,
      body: {
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
        buyerStatus: 'PENDING',
        sellerStatus: 'PENDING',
        latitude: 10,
        longitude: 10,
      },
    });
  });

  it('should throw error if GetOrderById throws', async () => {
    (getOrderById.getOrderById as jest.Mock).mockImplementationOnce(async () => {
      throw new Error();
    });
    const httpResponse = sut.handle({ orderId: 'any_id' });
    await expect(httpResponse).rejects.toThrow(new Error());
  });

  it('should throw MissingParamsError if orderId was not provided', async () => {
    const httpResponse = sut.handle({ orderId: undefined });
    await expect(httpResponse).rejects.toThrow(new MissingParamsError({
      params: ['orderId'],
    }));
  });

  it('should throw NotFound if order was not found', async () => {
    (getOrderById.getOrderById as jest.Mock).mockImplementationOnce(async () => {
      throw new NotFound({
        entity: 'order',
      });
    });
    const httpResponse = sut.handle({ orderId: 'any_id' });
    await expect(httpResponse).rejects.toThrow(new NotFound({
      entity: 'order',
    }));
  });
});
