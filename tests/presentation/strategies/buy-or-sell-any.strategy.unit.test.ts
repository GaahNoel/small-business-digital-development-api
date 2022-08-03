import { UpdateActiveChallenge } from '@/domain/usecases/challenge/update-active-challenge';
import { BuyOrSellAnyStrategy } from '@/presentation/strategies';

describe('BuyOrSellAnyStrategy', () => {
  let sut: BuyOrSellAnyStrategy;
  let updateActiveChallenge: UpdateActiveChallenge;

  const mockedProgress = 1;
  const mockedProduct = {
    product: {
      id: 'any-id',
      productId: 'any-product-id',
      quantity: 1,
      price: 100,
      type: 'product' as 'product',
    },
  };

  const makeRequest = (progress: number = 1, items = []) => ({
    challenge: {
      id: 'any-id',
      challenge: {
        id: 'any_challenge_id',
        description: 'any_description',
        type: 'buyAny' as 'buyAny',
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
    sut = new BuyOrSellAnyStrategy(updateActiveChallenge);
  });

  it('should call updateActiveChallenge with correct params if should change status to COMPLETED', async () => {
    await sut.handle(makeRequest(4, [mockedProduct]));

    expect(updateActiveChallenge.updateActiveChallenge).toHaveBeenCalledWith({
      activeChallengeId: 'any-id',
      progress: 5,
      status: 'COMPLETED',
    });
  });

  it('should change status to COMPLETED', async () => {
    await sut.handle(makeRequest(3, [mockedProduct, mockedProduct]));

    expect(updateActiveChallenge.updateActiveChallenge).toHaveBeenCalledWith({
      activeChallengeId: 'any-id',
      progress: 5,
      status: 'COMPLETED',
    });
  });
  it('should call updateActiveChallenge with correct params if should not change status', async () => {
    await sut.handle(makeRequest(1, [mockedProduct]));

    expect(updateActiveChallenge.updateActiveChallenge).toHaveBeenCalledWith({
      activeChallengeId: 'any-id',
      progress: mockedProgress + 1,
      status: 'PENDING',
    });
  });
  it('should return status if called successfully', async () => {
    const result = await sut.handle(makeRequest(1, [mockedProduct]));
    expect(result).toEqual({
      status: 'PENDING',
    });
  });

  it('should throw error if updateActiveChallenge throws', async () => {
    (updateActiveChallenge.updateActiveChallenge as jest.Mock).mockImplementationOnce(async () => Promise.reject(new Error()));

    const promise = sut.handle(makeRequest());

    await expect(promise).rejects.toThrow();
  });
});
