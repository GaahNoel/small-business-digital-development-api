import { CreateAccountBonusRepository } from '@/data/protocols/db/bonus';
import { GetAccountBonusRepository } from '@/data/protocols/db/bonus/get-account-bonus.repository';
import { GetBonusByIdRepository } from '@/data/protocols/db/bonus/get-bonus-by-id.repository';
import { DbCreateAccountBonus } from '@/data/usecases/bonus';

describe('DbCreateAccountBonus', () => {
  let sut: DbCreateAccountBonus;
  let createAccountBonusRepository: CreateAccountBonusRepository;
  let getBonusByIdRepository: GetBonusByIdRepository;
  let getAccountBonusRepository: GetAccountBonusRepository;

  beforeAll(() => {
    createAccountBonusRepository = {
      createAccountBonus: jest.fn(async () => Promise.resolve({
        accountBonusId: 'any_id',
      })),
    };

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

    getAccountBonusRepository = {
      getAccountBonus: jest.fn(async () => Promise.resolve([])),
    };
  });

  beforeEach(() => {
    sut = new DbCreateAccountBonus(createAccountBonusRepository, getBonusByIdRepository, getAccountBonusRepository);
  });

  it('should call CreateAccountBonusRepository with correct values if is coupon', async () => {
    const params = {
      accountId: 'any_id',
      bonusId: 'any_id',
      quantity: 1,
      measure: 'percent',
      value: 10,
    };

    await sut.createAccountBonus(params);

    expect(createAccountBonusRepository.createAccountBonus).toHaveBeenCalledWith(params);
  });
  it('should call CreateAccountBonusRepository with correct values if is highlight', async () => {
    (getBonusByIdRepository.getBonusById as jest.Mock).mockImplementationOnce(async () => Promise.resolve({
      id: 'any_id',
      name: 'any_name',
      description: 'any_description',
      price: 10,
      duration: 10,
      type: 'highlight',
      percent: 10,
    }));

    const params = {
      accountId: 'any_id',
      bonusId: 'any_id',
      quantity: 1,
      measure: 'priority',
      value: 0,
    };

    await sut.createAccountBonus(params);

    expect(createAccountBonusRepository.createAccountBonus).toHaveBeenCalledWith(params);
  });

  it('should return account bonus id if called successfully', async () => {
    const params = {
      accountId: 'any_id',
      bonusId: 'any_id',
      quantity: 1,
      measure: 'percent',
      value: 10,
    };

    const result = await sut.createAccountBonus(params);

    expect(result).toEqual({
      accountBonusId: 'any_id',
    });
  });

  it('should throw if CreateAccountBonusRepository throws', async () => {
    (createAccountBonusRepository.createAccountBonus as jest.Mock).mockImplementationOnce(async () => {
      throw new Error();
    });

    const params = {
      accountId: 'any_id',
      bonusId: 'any_id',
      quantity: 1,
    };

    const promise = sut.createAccountBonus(params);

    await expect(promise).rejects.toThrow();
  });
});
