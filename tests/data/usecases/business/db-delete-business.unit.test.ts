import { DeleteBusinessRepository } from '@/data/protocols/db/business';
import { DbDeleteBusiness } from '@/data/usecases/business';

describe('DbDeleteBusiness', () => {
  let dbDeleteBusiness: DbDeleteBusiness;
  let deleteBusinessRepository: DeleteBusinessRepository;

  beforeAll(() => {
    deleteBusinessRepository = {
      delete: jest.fn(async () => Promise.resolve({
        delete: true,
        id: 'any-id',
      })),
    };
  });

  beforeEach(() => {
    dbDeleteBusiness = new DbDeleteBusiness(deleteBusinessRepository);
  });

  it('should call deleteBusinessRepository with correct params', async () => {
    const deleteBusinessParams = {
      businessId: 'any-business-id',
    };

    await dbDeleteBusiness.delete(deleteBusinessParams);

    expect(deleteBusinessRepository.delete).toHaveBeenCalledWith(deleteBusinessParams);
  });

  it('should return a result with delete true', async () => {
    const deleteBusinessParams = {
      businessId: 'any-business-id',
    };

    const result = await dbDeleteBusiness.delete(deleteBusinessParams);

    expect(result).toEqual({
      delete: true,
      id: 'any-id',
    });
  });
});
