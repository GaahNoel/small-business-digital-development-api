import { GetAccountBonuses } from '@/domain/usecases/bonus';
import { success } from '@/presentation/helpers/http.helpers';
import { GetAccountBonusesController } from '@/presentation/controller/bonus';
import { InvalidParamsError, MissingParamsError } from '@/presentation/errors';

describe('GetAccountBonusesController', () => {
  let sut: GetAccountBonusesController;
  let getAccountBonuses: GetAccountBonuses;

  beforeAll(() => {
    getAccountBonuses = {
      getBonuses: jest.fn(async () => Promise.resolve([])),
    };
  });

  beforeEach(() => {
    sut = new GetAccountBonusesController(getAccountBonuses);
  });

  it('should call getAccountBonuses with correct params and return correct result', async () => {
    const httpResponse = await sut.handle({
      accountId: 'any_account_id',
      type: 'coupon',
      status: 'ACTIVE',
    });

    expect(getAccountBonuses.getBonuses).toHaveBeenCalledWith({
      accountId: 'any_account_id',
      type: 'coupon',
      status: 'ACTIVE',
    });
    expect(httpResponse).toEqual(success([]));
  });

  it.each([{
    params: {
      accountId: 'any_account_id',
      type: undefined,
    },
    missing: ['type'],
  },
  {
    params: {
      accountId: undefined,
      type: 'coupon' as 'coupon',
    },
    missing: ['accountId'],
  }])('should throw missingParamsError if missing required params', async ({ params, missing }) => {
    const promise = sut.handle(params);

    await expect(promise).rejects.toThrow(new MissingParamsError({
      params: missing,
    }));
  });
  it('should throw InvalidParamsError if type is invalid', async () => {
    const promise = sut.handle({
      accountId: 'any_account_id',
      type: 'invalid_type' as 'coupon',
    });

    await expect(promise).rejects.toThrow(new InvalidParamsError({
      params: ['type'],
    }));
  });
});
