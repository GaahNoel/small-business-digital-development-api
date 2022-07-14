import { GetOrderById } from '@/domain/usecases/order';
import { GetOrderByIdController } from '@/presentation/controller/order';
import { MissingParamsError, NotFound } from '@/presentation/errors';
import { badRequest, internalServerError, notFound } from '@/presentation/helpers/http.helpers';

describe('GetOrderByIdController', () => {
  let sut: GetOrderByIdController;
  let getOrderById: GetOrderById;

  beforeAll(() => {
    getOrderById = {
      getOrderById: jest.fn(async () => Promise.resolve({
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
        id: 'any_id',
        status: 'PENDING',
        total: 100,
        businessId: 'any_business_id',
        buyerId: 'any_buyer_id',
        items: [],
      },
    });
  });

  it('should return internalServerError if GetOrderById throws', async () => {
    (getOrderById.getOrderById as jest.Mock).mockImplementationOnce(async () => {
      throw new Error();
    });
    const httpResponse = await sut.handle({ orderId: 'any_id' });
    expect(httpResponse).toEqual(internalServerError(new Error()));
  });

  it('should return badRequest if orderId was not provided', async () => {
    const httpResponse = await sut.handle({ orderId: undefined });
    expect(httpResponse).toEqual(badRequest(new MissingParamsError({
      params: ['orderId'],
    })));
  });

  it('should return notFound if order was not found', async () => {
    (getOrderById.getOrderById as jest.Mock).mockImplementationOnce(async () => {
      throw new NotFound({
        entity: 'order',
      });
    });
    const httpResponse = await sut.handle({ orderId: 'any_id' });
    expect(httpResponse).toEqual(notFound(new NotFound({
      entity: 'order',
    })));
  });
});
