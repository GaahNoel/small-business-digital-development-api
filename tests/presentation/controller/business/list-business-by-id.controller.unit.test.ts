import { ListBusinessById } from '@/domain/usecases/business/list-business-by-id';
import { ListBusinessByIdController } from '@/presentation/controller/business/list-business-by-id.controller';
import { InternalServerError, MissingParamsError } from '@/presentation/errors';

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
      },
    });
  });

  it('should return 500 if listBusinessById throws', async () => {
    (listBusinessById.list as jest.Mock).mockImplementationOnce(() => {
      throw new Error();
    });
    const httpResponse = await sut.handle({ businessId: 'any_business_id' });
    expect(httpResponse).toEqual({
      statusCode: 500,
      body: new InternalServerError(new Error().stack),
    });
  });

  it('should return bad request if businessId is not provided', async () => {
    const httpResponse = await sut.handle({ businessId: undefined });
    expect(httpResponse).toEqual({
      statusCode: 400,
      body: new MissingParamsError({
        params: ['businessId'],
      }),
    });
  });
});
