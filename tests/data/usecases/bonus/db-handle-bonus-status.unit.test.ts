import { ChangeBonusStatusRepository } from '@/data/protocols/db/bonus';
import { ListAccountBonusRepository } from '@/data/protocols/db/bonus/list-account-bonuses.repository';
import { DbHandleBonusStatus } from '@/data/usecases/bonus';

describe('DbHandleBonusStatus', () => {
  let sut: DbHandleBonusStatus;
  let listAccountBonusRepository: ListAccountBonusRepository;
  let changeBonusStatusRepository: ChangeBonusStatusRepository;

  beforeAll(() => {
    listAccountBonusRepository = {
      listAccountBonuses: jest.fn(async () => Promise.resolve([{
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
        createdAt: new Date('2020-01-01'),
        updatedAt: new Date('2020-01-01'),
      }, {
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
        createdAt: new Date(new Date().setDate(new Date().getDate() + 1)),
        updatedAt: new Date(new Date().setDate(new Date().getDate() + 1)),
      }])),
    };

    changeBonusStatusRepository = {
      changeBonusStatus: jest.fn(async () => Promise.resolve({
        status: 'EXPIRED',
      })),
    };
  });

  beforeEach(() => {
    sut = new DbHandleBonusStatus(listAccountBonusRepository, changeBonusStatusRepository);
  });

  it('should call ListAccountBonusRepository with correct params', async () => {
    await sut.handleStatus();

    expect(listAccountBonusRepository.listAccountBonuses).toHaveBeenCalledWith({});
  });

  it('should call ChangeBonusStatusRepository with correct params', async () => {
    await sut.handleStatus();

    expect(changeBonusStatusRepository.changeBonusStatus).toHaveBeenCalledWith({
      accountBonusId: 'any_id',
      status: 'EXPIRED',
    });
    expect(changeBonusStatusRepository.changeBonusStatus).toHaveBeenCalledTimes(1);
  });

  it('should throw error if ListAccountBonusRepository throws', async () => {
    (listAccountBonusRepository.listAccountBonuses as jest.Mock).mockImplementation(async () => {
      throw new Error();
    });
    const promise = sut.handleStatus();

    await expect(promise).rejects.toThrow();
  });
  it('should throw error if changeBonusStatusRepository throws', async () => {
    (changeBonusStatusRepository.changeBonusStatus as jest.Mock).mockImplementation(async () => {
      throw new Error();
    });
    const promise = sut.handleStatus();

    await expect(promise).rejects.toThrow();
  });
});
