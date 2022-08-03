import { GetAccountBonusRepository } from '@/data/protocols/db/bonus';
import { DbGetAccountBonuses } from '@/data/usecases/bonus';
import { NotFound } from '@/presentation/errors';

describe('DbGetAccountBonuses', () => {
  let sut: DbGetAccountBonuses;
  let getAccountBonusRepository: GetAccountBonusRepository;

  beforeAll(() => {
    getAccountBonusRepository = {
      getAccountBonus: jest.fn(async () => Promise.resolve([{
        id: 'any_id',
        accountId: 'any_account_id',
        bonus: {
          id: 'any_bonus_id',
          name: 'any_bonus_name',
          description: 'any_bonus_description',
          price: 10,
          duration: 10,
          type: 'coupon',
          percent: 10,
        },
        quantity: 10,
        status: 'ACTIVE',
        measure: 'percent',
        value: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      }])),
    };
  });

  beforeEach(() => {
    sut = new DbGetAccountBonuses(getAccountBonusRepository);
  });

  it('should call GetAccountBonusRepository with correct values', async () => {
    await sut.getBonuses({
      accountId: 'any_account_id',
      type: 'coupon',
      status: 'ACTIVE',
    });
    expect(getAccountBonusRepository.getAccountBonus).toHaveBeenCalledWith({
      accountId: 'any_account_id',
      type: 'coupon',
      status: 'ACTIVE',
    });
  });
  it('should call GetAccountBonusRepository with correct values and use default status', async () => {
    await sut.getBonuses({
      accountId: 'any_account_id',
      type: 'coupon',
    });
    expect(getAccountBonusRepository.getAccountBonus).toHaveBeenCalledWith({
      accountId: 'any_account_id',
      type: 'coupon',
      status: 'ACTIVE',
    });
  });

  it('should throw not found error if no bonus found', async () => {
    (getAccountBonusRepository.getAccountBonus as jest.Mock).mockImplementationOnce(async () => Promise.resolve([]));
    const promise = sut.getBonuses({
      accountId: 'any_account_id',
      type: 'coupon',
      status: 'ACTIVE',
    });
    await expect(promise).rejects.toThrow(new NotFound({
      entity: 'Bonus',
    }));
  });

  it('should throw error if getAccountBonusRepository throws', async () => {
    (getAccountBonusRepository.getAccountBonus as jest.Mock).mockImplementationOnce(async () => {
      throw new Error();
    });
    const promise = sut.getBonuses({
      accountId: 'any_account_id',
      type: 'coupon',
      status: 'ACTIVE',
    });
    await expect(promise).rejects.toThrow();
  });
});
