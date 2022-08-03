import { ListBusinessByIdRepository } from '@/data/protocols/db/business/list-business-by-id.repository';
import { DbListBusinessById } from '@/data/usecases/business/db-list-business-by-id';
import { NotFound } from '@/presentation/errors/not-found.error';

describe('DbListBusinessById', () => {
  let sut: DbListBusinessById;
  let listBusinessByIdRepository: ListBusinessByIdRepository;

  beforeAll(() => {
    listBusinessByIdRepository = {
      listById: jest.fn(async () => Promise.resolve({
        id: 'any_id',
        name: 'any_name',
        description: 'any_description',
        accountId: 'any_account_id',
        imageUrl: 'any_image_url',
        productIds: ['any_product_id'],
        latitude: 'any_latitude',
        longitude: 'any_longitude',
        street: 'any_street',
        city: 'any_city',
        state: 'any_state',
        zip: 'any_zip',
        country: 'any_country',
        maxPermittedCouponPercentage: 10,
      })),
    };
  });

  beforeEach(() => {
    sut = new DbListBusinessById(listBusinessByIdRepository);
  });

  it('should call listBusinessByIdRepository with correct values', async () => {
    const businessId = 'any_business_id';
    await sut.list({ businessId });
    expect(listBusinessByIdRepository.listById).toHaveBeenCalledWith({ businessId });
  });

  it('should return a business on success', async () => {
    const businessId = 'any_business_id';
    const business = await sut.list({ businessId });
    expect(business).toEqual({
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
      maxPermittedCouponPercentage: 10,
    });
  });

  it('should throw error if listBusinessByIdRepository throws', () => {
    (listBusinessByIdRepository.listById as jest.Mock).mockImplementation(async () => Promise.reject(new Error()));

    expect(sut.list({ businessId: 'any_business_id' })).rejects.toThrow();
  });

  it('should throw not found error if not found on db', () => {
    (listBusinessByIdRepository.listById as jest.Mock).mockImplementation(async () => Promise.resolve(null));

    expect(sut.list({ businessId: 'any_business_id' })).rejects.toThrowError(new NotFound({ entity: 'Business' }));
  });
});
