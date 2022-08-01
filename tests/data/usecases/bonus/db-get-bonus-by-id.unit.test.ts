import { GetBonusByIdRepository } from '@/data/protocols/db/bonus/get-bonus-by-id.repository';
import { DbGetBonusById } from '@/data/usecases/bonus';

describe('DbGetBonusById', () => {
  let sut: DbGetBonusById;
  let getBonusByIdRepository: GetBonusByIdRepository;

  beforeAll(() => {
    getBonusByIdRepository = {
      getBonusById: jest.fn(async () => Promise.resolve({
        id: 'any_id',
        name: 'any_name',
        description: 'any_description',
        price: 10,
        duration: 10,
        type: 'coupon',
        percent: 10,
      })),
    };
  });

  beforeEach(() => {
    sut = new DbGetBonusById(getBonusByIdRepository);
  });

  it('should call getBonusByIdRepository with correct params and return bonus', async () => {
    const params = {
      bonusId: 'any_id',
    };
    const bonus = await sut.getById(params);

    expect(getBonusByIdRepository.getBonusById).toHaveBeenCalledWith(params);
    expect(bonus).toEqual({
      id: 'any_id',
      name: 'any_name',
      description: 'any_description',
      price: 10,
      duration: 10,
      type: 'coupon',
      percent: 10,
    });
  });

  it('should throw error if getBonusByIdRepository throws', async () => {
    (getBonusByIdRepository.getBonusById as jest.Mock).mockReturnValueOnce(Promise.reject(new Error()));
    const promise = sut.getById({ bonusId: 'any_id' });

    await expect(promise).rejects.toThrow();
  });
});
