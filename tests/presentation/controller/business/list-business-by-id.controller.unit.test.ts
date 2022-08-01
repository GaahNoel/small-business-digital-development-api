import { ListBusinessById } from '@/domain/usecases/business/list-business-by-id';
import { ListBusinessByIdController } from '@/presentation/controller/business/list-business-by-id.controller';
import { MissingParamsError, NotFound } from '@/presentation/errors';

describe('ListBusinessByIdController', () => {
  let sut: ListBusinessByIdController;
  let listBusinessById: ListBusinessById;

  beforeAll(() => {
    listBusinessById = {
      list: jest.fn(async () => Promise.resolve({
        id: 'any_id',
        name: 'any_name',
        description: 'any_description',
        accountId: 'any_account_id',
        imageUrl: 'any_image_url',
        latitude: 'any_latitude',
        longitude: 'any_longitude',
        street: 'any_street',
        city: 'any_city',
        state: 'any_state',
        zip: 'any_zip',
        country: 'any_country',
        maxPermittedCouponPercentage: 5,
      })),
    };
  });

  beforeEach(() => {
    sut = new ListBusinessByIdController(listBusinessById);
  });

  it('should call listBusinessById with correct values', async () => {
    const businessId = 'any_business_id';
    await sut.handle({ businessId });
    expect(listBusinessById.list).toHaveBeenCalledWith({ businessId });
  });

  it('should return 200 if listBusinessById returns a business', async () => {
    const businessId = 'any_business_id';
    const httpResponse = await sut.handle({ businessId });
    expect(httpResponse).toEqual({
      statusCode: 200,
      body: {
        id: 'any_id',
        name: 'any_name',
        description: 'any_description',
        accountId: 'any_account_id',
        imageUrl: 'any_image_url',
        latitude: 'any_latitude',
        longitude: 'any_longitude',
        street: 'any_street',
        city: 'any_city',
        state: 'any_state',
        zip: 'any_zip',
        country: 'any_country',
        maxPermittedCouponPercentage: 5,
      },
    });
  });

  it('should throw InternalServerError if listBusinessById throws unhandled error', async () => {
    (listBusinessById.list as jest.Mock).mockImplementationOnce(() => {
      throw new Error();
    });
    const httpResponse = sut.handle({ businessId: 'any_business_id' });
    await expect(httpResponse).rejects.toThrow(
      new Error(),
    );
  });

  it('should throw MissingParamsError if businessId is not provided', async () => {
    const httpResponse = sut.handle({ businessId: undefined });
    await expect(httpResponse).rejects.toThrow(new MissingParamsError({
      params: ['businessId'],
    }));
  });

  it('should return not found if business not found', async () => {
    (listBusinessById.list as jest.Mock).mockImplementationOnce(() => {
      throw new NotFound({
        entity: 'Business',
      });
    });
    const httpResponse = sut.handle({ businessId: 'any_business_id' });
    await expect(httpResponse).rejects.toThrow(new NotFound({
      entity: 'Business',
    }));
  });
});
