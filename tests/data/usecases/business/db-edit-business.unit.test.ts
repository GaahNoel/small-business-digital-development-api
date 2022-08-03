import { EditBusinessRepository } from '@/data/protocols/db/business/edit-business.repository';
import { DbEditBusiness } from '@/data/usecases/business';

describe('DbEditBusiness', () => {
  let dbEditBusiness: DbEditBusiness;
  let editBusinessRepository: EditBusinessRepository;

  const editBusinessParams = {
    businessId: 'any_id',
    name: 'any_name',
    imageUrl: 'any_image_url',
    accountId: 'any_account_id',
    description: 'any_description',
    latitude: 'any_latitude',
    longitude: 'any_longitude',
    street: 'any_street',
    city: 'any_city',
    state: 'any_state',
    zip: 'any_zip',
    country: 'any_country',
    maxPermittedCouponPercentage: 5,
  };

  beforeAll(() => {
    editBusinessRepository = {
      edit: jest.fn(async () => Promise.resolve({ id: 'any_id' })),
    };
  });

  beforeEach(() => {
    dbEditBusiness = new DbEditBusiness(editBusinessRepository);
  });
  it('should call editBusinessRepository with correct params', async () => {
    await dbEditBusiness.edit(editBusinessParams);

    expect(editBusinessRepository.edit).toHaveBeenCalledWith(editBusinessParams);
  });

  it('should return business id if editBusinessRepository returns business id', async () => {
    const result = await dbEditBusiness.edit(editBusinessParams);

    expect(result).toEqual({ id: 'any_id' });
  });

  it('should throw if editBusinessRepository throws', async () => {
    (editBusinessRepository.edit as jest.Mock).mockImplementationOnce(async () => Promise.reject(new Error('any_error')));

    await expect(dbEditBusiness.edit(editBusinessParams)).rejects.toThrow('any_error');
  });
});
