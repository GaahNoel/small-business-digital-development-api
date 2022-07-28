import { GetAccountChallenges } from '@/domain/usecases/challenge';
import { GetOrderById } from '@/domain/usecases/order';
import { ChangeOrderStatusController } from '@/presentation/controller/order';
import { ChangeOrderStatusHandleChallengeDecorator } from '@/presentation/decorators';
import { internalServerError, success } from '@/presentation/helpers/http.helpers';
import { BuyOrSellAnyOnlyProductOrService, BuyOrSellAnyStrategy } from '@/presentation/strategies';
import { ChangeOrderStatus } from '@/domain/usecases/order/change-order-status';
import { ChallengeType } from '@/domain/models/challenge';
import { AddAccountBalance } from '@/domain/usecases/account/add-account-balance';
import { UpdateActiveChallenge } from '@/domain/usecases/challenge/update-active-challenge';

describe('ChangeOrderStatusHandleChallengeDecorator', () => {
  let sut: ChangeOrderStatusHandleChallengeDecorator;
  let controller: ChangeOrderStatusController;
  let changeOrderStatus: ChangeOrderStatus;
  let getOrderById: GetOrderById;
  let getAccountChallenges: GetAccountChallenges;
  let addAccountBalance: AddAccountBalance;
  let buyOrSellAnyStrategy: BuyOrSellAnyStrategy;
  let buyOrSellAnyOnlyProductOrService: BuyOrSellAnyOnlyProductOrService;
  let updateActiveChallenge: UpdateActiveChallenge;

  const makeRequest = () => ({
    orderId: 'any-id',
    authAccountId: 'any-account-id',
    status: 'COMPLETED' as 'COMPLETED',
  });

  const makeChallenge = (type: ChallengeType = 'buyAny', status: 'COMPLETED' | 'PENDING' = 'PENDING') => ({
    id: 'any_id',
    challenge: {
      id: 'any_challenge_id',
      description: 'any_description',
      type,
      goal: 5,
      periodicity: 'daily' as 'daily',
      reward: 100,
      createdAt: new Date('2022-03-10'),
      updatedAt: new Date('2022-03-10'),
    },
    accountId: 'any_account_id',
    progress: 1,
    status,
    createdAt: new Date('2022-03-10'),
    updatedAt: new Date('2022-03-10'),
  });

  beforeAll(() => {
    changeOrderStatus = {
      changeOrderStatus: jest.fn(async () => Promise.resolve({
        orderId: 'any-id',
        status: 'COMPLETED',
        buyerStatus: 'COMPLETED',
        sellerStatus: 'COMPLETED',
      })),
    };

    getOrderById = {
      getOrderById: jest.fn(async () => Promise.resolve({
        id: 'any-id',
        businessId: 'string',
        buyerId: 'any_account_id',
        total: 100,
        items: [],
        status: 'PENDING' as 'PENDING',
        createdAt: new Date('2022-02-10'),
        updatedAt: new Date('2022-02-10'),
        description: 'any-description',
        paymentMethod: 'CreditCard' as 'CreditCard',
        change: 10,
        sellerId: 'any-seller-id',
        buyerStatus: 'PENDING',
        sellerStatus: 'PENDING',
        latitude: 10,
        longitude: 10,
      })),
    };

    getAccountChallenges = {
      getAccountChallenges: jest.fn(async () => Promise.resolve({
        challenges: [makeChallenge(), makeChallenge('buyAny', 'COMPLETED')],
      })),
    };

    addAccountBalance = {
      addBalance: jest.fn(async () => Promise.resolve({
        newBalance: 3,
      })),
    };

    updateActiveChallenge = {
      updateActiveChallenge: jest.fn(async () => Promise.resolve({
        status: 'COMPLETED',
      })),
    };
    buyOrSellAnyOnlyProductOrService = new BuyOrSellAnyOnlyProductOrService(updateActiveChallenge);

    buyOrSellAnyStrategy = new BuyOrSellAnyStrategy(updateActiveChallenge);
    controller = new ChangeOrderStatusController(changeOrderStatus);
  });

  beforeEach(() => {
    jest.spyOn(buyOrSellAnyStrategy, 'handle')
      .mockImplementationOnce(jest.fn(async () => Promise.resolve({
        status: 'COMPLETED',
      })));

    sut = new ChangeOrderStatusHandleChallengeDecorator(
      controller,
      getOrderById,
      getAccountChallenges,
      addAccountBalance,
      buyOrSellAnyStrategy,
      buyOrSellAnyOnlyProductOrService,
    );
  });

  it('should call controller with correct params', async () => {
    const controllerSpy = jest.spyOn(controller, 'handle');
    await sut.handle(makeRequest());

    expect(controllerSpy).toHaveBeenCalledWith(makeRequest());
  });

  it('should return response if called successfully', async () => {
    jest.spyOn(controller, 'handle').mockImplementationOnce(() => Promise.resolve(success({ status: 'COMPLETED' })));

    const response = await sut.handle(makeRequest());

    expect(response).toEqual(success({
      status: 'COMPLETED',
    }));
  });

  it('should call buyAnyStrategy with correct params and not call with seller', async () => {
    (getAccountChallenges.getAccountChallenges as jest.Mock)
      .mockImplementationOnce(jest.fn(async () => Promise.resolve({
        challenges: [makeChallenge('buyAny', 'PENDING'), makeChallenge('buyAny', 'PENDING'), makeChallenge('buyAny', 'COMPLETED')],
      })))
      .mockImplementationOnce(jest.fn(async () => Promise.resolve({
        challenges: [makeChallenge('sellAny', 'PENDING')],
      })));

    const buyAnyStrategySpy = jest.spyOn(buyOrSellAnyStrategy, 'handle')
      .mockImplementationOnce(jest.fn(async () => Promise.resolve({
        status: 'PENDING',
      })));

    await sut.handle(makeRequest());

    expect(buyAnyStrategySpy).toHaveBeenCalledTimes(3);
  });

  it('should call addAccountBalance with correct value when buyer has completed challenges', async () => {
    await sut.handle(makeRequest());

    expect(addAccountBalance.addBalance).toBeCalledWith({
      accountId: 'any_account_id',
      balance: 100,
    });

    expect(addAccountBalance.addBalance).toBeCalledWith({
      accountId: 'any-seller-id',
      balance: 0,
    });
  });

  it('should call addAccountBalance with correct value when seller has completed challenges', async () => {
    (getAccountChallenges.getAccountChallenges as jest.Mock)
      .mockImplementationOnce(jest.fn(async () => Promise.resolve({
        challenges: [makeChallenge('buyAny', 'COMPLETED'), makeChallenge('buyTogheter' as 'buyAny', 'PENDING')],
      })))
      .mockImplementationOnce(jest.fn(async () => Promise.resolve({
        challenges: [makeChallenge('sellAny', 'PENDING')],
      })));

    (getOrderById.getOrderById as jest.Mock).mockImplementationOnce(async () => Promise.resolve({
      id: 'any-id',
      businessId: 'string',
      buyerId: 'any-buyer-id',
      total: 100,
      items: [],
      status: 'PENDING' as 'PENDING',
      createdAt: new Date('2022-02-10'),
      updatedAt: new Date('2022-02-10'),
      description: 'any-description',
      paymentMethod: 'CreditCard' as 'CreditCard',
      change: 10,
      sellerId: 'any_account_id',
      buyerStatus: 'PENDING',
      sellerStatus: 'PENDING',
      latitude: 10,
      longitude: 10,
    }));

    await sut.handle(makeRequest());

    expect(addAccountBalance.addBalance).toBeCalledWith({
      accountId: 'any-buyer-id',
      balance: 0,
    });

    expect(addAccountBalance.addBalance).toBeCalledWith({
      accountId: 'any_account_id',
      balance: 100,
    });
  });

  it('should call buyOrSellAnyOnlyProductOrService with correct params', async () => {
    (getAccountChallenges.getAccountChallenges as jest.Mock)
      .mockImplementationOnce(jest.fn(async () => Promise.resolve({
        challenges: [makeChallenge('buyProduct', 'PENDING'), makeChallenge('buyService', 'PENDING'), makeChallenge('sellProduct', 'PENDING')],
      })))
      .mockImplementationOnce(jest.fn(async () => Promise.resolve({
        challenges: [makeChallenge('buyAny', 'PENDING'), makeChallenge('sellProduct', 'PENDING'), makeChallenge('sellService', 'PENDING')],
      })));

    const buyOrSellAnyOnlyProductOrServiceSpy = jest.spyOn(buyOrSellAnyOnlyProductOrService, 'handle')
      .mockImplementationOnce(jest.fn(async () => Promise.resolve({
        status: 'PENDING',
      })));

    await sut.handle(makeRequest());

    expect(buyOrSellAnyOnlyProductOrServiceSpy).toHaveBeenCalledTimes(4);
  });

  it('should return controller response if order status not success', async () => {
    jest.spyOn(controller, 'handle').mockImplementationOnce(() => Promise.resolve(success({ status: 'PENDING' })));
    const response = await sut.handle(makeRequest());

    expect(response).toEqual(success({
      status: 'PENDING',
    }));
  });

  it('should return internalServerError if controller throws', async () => {
    jest.spyOn(controller, 'handle').mockImplementationOnce(() => Promise.reject(new Error()));
    const response = await sut.handle(makeRequest());

    expect(response).toEqual(internalServerError(new Error()));
  });
});
