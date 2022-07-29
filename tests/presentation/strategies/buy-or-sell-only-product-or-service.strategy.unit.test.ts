import { UpdateActiveChallenge } from '@/domain/usecases/challenge/update-active-challenge';
import { BuyOrSellAnyOnlyProductOrServiceStrategy } from '@/presentation/strategies';

describe('BuyOrSellOnlyProductOrService', () => {
  let sut: BuyOrSellAnyOnlyProductOrServiceStrategy;
  let updateActiveChallenge: UpdateActiveChallenge;

  const mockedProgress = 1;

  const makeRequest = (items = [], progress: number = 4, challengeType: 'buyProduct' | 'sellService' = 'buyProduct') => ({
    challenge: {
      id: 'any-id',
      challenge: {
        id: 'any_challenge_id',
        description: 'any_description',
        type: challengeType,
        goal: 5,
        periodicity: 'daily' as 'daily',
        reward: 100,
        createdAt: new Date('2020-12-12'),
        updatedAt: new Date('2020-12-12'),
      },
      accountId: 'any-id',
      progress,
      status: 'PENDING' as 'PENDING',
      createdAt: new Date('2020-12-12'),
      updatedAt: new Date('2020-12-12'),
    },
    orderInfos: {
      id: 'any-id',
      businessId: 'string',
      buyerId: 'string',
      total: 100,
      items,
      status: 'PENDING' as 'PENDING',
      createdAt: new Date('2022-02-10'),
      updatedAt: new Date('2022-02-10'),
      description: 'any-description',
      paymentMethod: 'CreditCard' as 'CreditCard',
      change: 10,
      sellerId: 'any-seller-id',
      buyerStatus: 'PENDING' as 'PENDING',
      sellerStatus: 'PENDING' as 'PENDING',
      latitude: 10,
      longitude: 10,
    },
  });

  beforeAll(() => {
    updateActiveChallenge = {
      updateActiveChallenge: jest.fn(async () => Promise.resolve({
        activeChallengeId: 'any_challenge_id',
        progress: mockedProgress + 1,
        status: 'PENDING',
      })),
    };
  });

  beforeEach(() => {
    sut = new BuyOrSellAnyOnlyProductOrServiceStrategy(updateActiveChallenge);
  });

  it('should return pending if no challenge match with the bought product', async () => {
    const request = makeRequest();
    const result = await sut.handle(request);
    expect(result.status).toEqual('PENDING');
  });

  it('should call updateActiveChallenge with correct params if should change status to COMPLETED and return status COMPLETED', async () => {
    const request = makeRequest([{
      product: {
        id: 'any-id',
        productId: 'any-product-id',
        quantity: 1,
        price: 100,
        type: 'product' as 'product',
      },
    }]);
    const response = await sut.handle(request);
    expect(updateActiveChallenge.updateActiveChallenge).toHaveBeenCalledWith({
      activeChallengeId: 'any-id',
      progress: 5,
      status: 'COMPLETED',
    });
    expect(response.status).toEqual('COMPLETED');
  });

  it('should call updateActiveChallenge with correct params if should not change status and return status PENDING', async () => {
    const request = makeRequest([{
      product: {
        id: 'any-id',
        productId: 'any-product-id',
        quantity: 1,
        price: 100,
        type: 'product' as 'product',
      },
    }], 1);
    const response = await sut.handle(request);
    expect(updateActiveChallenge.updateActiveChallenge).toHaveBeenCalledWith({
      activeChallengeId: 'any-id',
      progress: 2,
      status: 'PENDING',
    });
    expect(response.status).toEqual('PENDING');
  });

  it('should return status COMPLETED', async () => {
    const request = makeRequest([{
      product: {
        id: 'any-id',
        productId: 'any-product-id',
        quantity: 1,
        price: 100,
        type: 'product' as 'product',
      },
    },
    {
      product: {
        id: 'any-id',
        productId: 'any-product-id',
        quantity: 1,
        price: 100,
        type: 'product' as 'product',
      },
    }], 3);
    const response = await sut.handle(request);

    expect(response.status).toEqual('COMPLETED');
  });

  it('should return status PENDING', async () => {
    const request = makeRequest([{
      product: {
        id: 'any-id',
        productId: 'any-product-id',
        quantity: 1,
        price: 100,
        type: 'product' as 'product',
      },
    },
    {
      product: {
        id: 'any-id',
        productId: 'any-product-id',
        quantity: 1,
        price: 100,
        type: 'service' as 'service',
      },
    }], 3);
    const response = await sut.handle(request);

    expect(response.status).toEqual('PENDING');
  });

  it('should return status COMPLETED when sold a service', async () => {
    const request = makeRequest([{
      product: {
        id: 'any-id',
        productId: 'any-product-id',
        quantity: 1,
        price: 100,
        type: 'product' as 'product',
      },
    },
    {
      product: {
        id: 'any-id',
        productId: 'any-product-id',
        quantity: 1,
        price: 100,
        type: 'service' as 'service',
      },
    }], 4, 'sellService');
    const response = await sut.handle(request);

    expect(response.status).toEqual('COMPLETED');
  });
});
