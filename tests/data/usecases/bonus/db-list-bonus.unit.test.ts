import { ListBonusRepository } from '@/data/protocols/db/bonus/list-bonus.repository';
import { DbListBonus } from '@/data/usecases/bonus';
import { NotFound } from '@/presentation/errors';

describe('DbListBonus', () => {
  let sut: DbListBonus;
  let listBonusRepository: ListBonusRepository;

  beforeAll(() => {
    listBonusRepository = {
      list: jest.fn(async () => Promise.resolve([{
        id: '1',
        name: 'Bonus 1',
        description: 'Bonus 1 description',
        price: 10,
        duration: 1,
        type: 'coupon',
        percent: 10,
      }])),
    };
  });

  beforeEach(() => {
    sut = new DbListBonus(listBonusRepository);
  });

  it('should call listBonusRepository with coupon if type was provided and it is client', async () => {
    const params = {
      type: 'client' as 'client',
    };

    await sut.listBonus(params);

    expect(listBonusRepository.list).toHaveBeenCalledWith({
      type: 'coupon',
    });
  });
  it('should call listBonusRepository with coupon if type was provided and it is business', async () => {
    const params = {
      type: 'business' as 'business',
    };

    await sut.listBonus(params);

    expect(listBonusRepository.list).toHaveBeenCalledWith({
      type: 'highlight',
    });
  });
  it('should call listBonusRepository with undefined if params was not provided', async () => {
    const params = { type: undefined };

    await sut.listBonus(params);

    expect(listBonusRepository.list).toHaveBeenCalledWith({ type: undefined });
  });
  it('should return bonuses if called successfully', async () => {
    const params = {
      type: 'client' as 'client',
    };

    const result = await sut.listBonus(params);

    expect(result).toEqual([{
      id: '1',
      name: 'Bonus 1',
      description: 'Bonus 1 description',
      price: 10,
      duration: 1,
      type: 'coupon',
      percent: 10,
    }]);
  });

  it('should throw not found error if no bonus was found', async () => {
    (listBonusRepository.list as jest.Mock).mockImplementationOnce(async () => Promise.resolve([]));

    const params = {
      type: 'client' as 'client',
    };

    const promise = sut.listBonus(params);

    await expect(promise).rejects.toThrow(new NotFound({
      entity: 'bonus',
    }));
  });

  it('should throw error if listBonusRepository throws', async () => {
    (listBonusRepository.list as jest.Mock).mockImplementationOnce(async () => {
      throw new Error();
    }).mockImplementationOnce(async () => Promise.resolve([]));

    const params = {
      type: 'client' as 'client',
    };

    const promise = sut.listBonus(params);

    await expect(promise).rejects.toThrow();
  });
});
