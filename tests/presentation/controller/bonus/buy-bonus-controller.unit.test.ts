import { WithdrawAccountBalance } from '@/domain/usecases/account/withdraw-account-balance';
import { CreateAccountBonus, GetBonusById } from '@/domain/usecases/bonus';
import { BuyBonusController } from '@/presentation/controller/bonus';
import { MissingParamsError } from '@/presentation/errors';
import { InvalidParamsError } from '@/presentation/errors/invalid-params.error';
import { badRequest, internalServerError, success } from '@/presentation/helpers/http.helpers';

describe('BuyBonusController', () => {
  let sut: BuyBonusController;
  let createAccountBonus: CreateAccountBonus;
  let withdrawAccountBalance: WithdrawAccountBalance;
  let getBonusById: GetBonusById;

  const makeRequest = () => ({
    bonusId: 'any_bonus_id',
    quantity: 1,
    accountId: 'any_account_id',
  });

  beforeAll(() => {
    createAccountBonus = {
      createAccountBonus: jest.fn(async () => Promise.resolve({
        accountBonusId: 'any_account_bonus_id',
      })),
    };

    withdrawAccountBalance = {
      withdraw: jest.fn(async () => Promise.resolve({
        newBalance: 0,
      })),
    };

    getBonusById = {
      getById: jest.fn(async () => Promise.resolve({
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
    sut = new BuyBonusController(getBonusById, createAccountBonus, withdrawAccountBalance);
  });

  it('should call getBonusById with correct params', async () => {
    const fakeRequest = makeRequest();
    await sut.handle(fakeRequest);
    expect(getBonusById.getById).toHaveBeenCalledWith({
      bonusId: fakeRequest.bonusId,
    });
  });
  it('should call withdrawAccountBalance with correct params', async () => {
    const fakeRequest = makeRequest();
    await sut.handle(fakeRequest);
    expect(withdrawAccountBalance.withdraw).toHaveBeenCalledWith({
      accountId: fakeRequest.accountId,
      amount: 10,
    });
  });
  it('should call createAccountBonus with correct params', async () => {
    const fakeRequest = makeRequest();
    await sut.handle(fakeRequest);
    expect(createAccountBonus.createAccountBonus).toHaveBeenCalledWith({
      accountId: fakeRequest.accountId,
      quantity: 1,
      bonusId: fakeRequest.bonusId,
    });
  });

  it('should return new balance and created account bonus if executed successfully', async () => {
    const fakeRequest = makeRequest();
    const response = await sut.handle(fakeRequest);
    expect(response).toEqual(success({
      newBalance: 0,
      accountBonusId: 'any_account_bonus_id',
    }));
  });

  it.each([{
    params: {
      bonusId: '',
      quantity: 0,
      accountId: '',
    },
    missing: ['bonusId', 'quantity', 'accountId'],
  }, {
    params: {
      bonusId: 'any',
      quantity: 0,
      accountId: '',
    },
    missing: ['quantity', 'accountId'],
  }, {
    params: {
      bonusId: '',
      quantity: 1,
      accountId: '',
    },
    missing: ['bonusId', 'accountId'],
  }, {
    params: {
      bonusId: '',
      quantity: 0,
      accountId: 'any',
    },
    missing: ['bonusId', 'quantity'],
  }])('should return badRequest if missingParamsError was thrown', async ({ params, missing }) => {
    makeRequest();
    const response = sut.handle(params);
    await expect(response).rejects.toThrow(new MissingParamsError({
      params: missing,
    }));
  });

  it('should return bad request if withdrawAccountBalance throws InvalidParamsError', async () => {
    (withdrawAccountBalance.withdraw as jest.Mock).mockImplementationOnce(async () => {
      throw new InvalidParamsError({
        params: ['amount'],
      });
    });
    const fakeRequest = makeRequest();
    const response = sut.handle(fakeRequest);
    await expect(response).rejects.toThrow(new InvalidParamsError({
      params: ['amount'],
    }));
  });
  it('should throw internalServerError if receive unhandled error', async () => {
    (withdrawAccountBalance.withdraw as jest.Mock).mockImplementationOnce(async () => {
      throw new Error();
    });
    const fakeRequest = makeRequest();
    const response = sut.handle(fakeRequest);
    await expect(response).rejects.toThrow(new Error());
  });
});
