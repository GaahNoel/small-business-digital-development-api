import { ListBonus } from '@/domain/usecases/bonus';
import { ListBonusController } from '@/presentation/controller/bonus';
import { NotFound } from '@/presentation/errors';
import { internalServerError, notFound, success } from '@/presentation/helpers/http.helpers';

describe('ListBonusController', () => {
  let sut: ListBonusController;
  let listBonus: ListBonus;

  beforeAll(() => {
    listBonus = {
      listBonus: jest.fn(() => Promise.resolve([{
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
    sut = new ListBonusController(listBonus);
  });

  it('should call list with correct params if provided type client', async () => {
    const params = {
      type: 'client' as 'client',
    };

    await sut.handle(params);

    expect(listBonus.listBonus).toHaveBeenCalledWith({
      type: 'client',
    });
  });
  it('should call list with correct params if provided type business', async () => {
    const params = {
      type: 'business' as 'business',
    };

    await sut.handle(params);

    expect(listBonus.listBonus).toHaveBeenCalledWith({
      type: 'business',
    });
  });
  it('should call list with correct params if type not provided', async () => {
    const params = { };

    await sut.handle(params);

    expect(listBonus.listBonus).toHaveBeenCalledWith({
      type: undefined,
    });
  });

  it('should return success if called correctly', async () => {
    const params = {
      type: 'client' as 'client',
    };

    const result = await sut.handle(params);

    expect(result).toEqual(success([{
      id: '1',
      name: 'Bonus 1',
      description: 'Bonus 1 description',
      price: 10,
      duration: 1,
      type: 'coupon',
      percent: 10,
    }]));
  });

  it('should return not found if listBonus throws not found error', async () => {
    const params = {
      type: 'client' as 'client',
    };

    (listBonus.listBonus as jest.Mock).mockImplementationOnce(() => Promise.reject(new NotFound({ entity: 'bonus' })));

    const result = sut.handle(params);

    await expect(result).rejects.toThrow(new NotFound({ entity: 'bonus' }));
  });

  it('should throw internalServerError if unhandled error was thrown by listBonus', async () => {
    const params = {
      type: 'client' as 'client',
    };

    (listBonus.listBonus as jest.Mock).mockImplementationOnce(() => Promise.reject(new Error()));

    const result = sut.handle(params);

    await expect(result).rejects.toThrow(new Error());
  });
});
