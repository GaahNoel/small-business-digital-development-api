import { ListBusinessById } from '@/domain/usecases/business';
import { UpdateActiveChallenge } from '@/domain/usecases/challenge/update-active-challenge';
import { BuyProximityStrategy } from '@/presentation/strategies';

describe('BuyProximityStrategy', () => {
  let sut: BuyProximityStrategy;
  let updateActiveChallenge: UpdateActiveChallenge;
  let getBusinessById: ListBusinessById;

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
      latitude: 1,
      longitude: 1,
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

    getBusinessById = {
      list: jest.fn(async () => Promise.resolve({
        id: 'any_id',
        name: 'any_name',
        description: 'any_description',
        accountId: 'any_account_id',
        imageUrl: 'any_image_url',
        latitude: '1',
        longitude: '1',
        street: 'any_street',
        city: 'any_city',
        state: 'any_state',
        zip: 'any_zip',
        country: 'any_country',
        maxPermittedCouponPercentage: 10,
      })),
    };
  });

  beforeEach(() => {
    sut = new BuyProximityStrategy(updateActiveChallenge, getBusinessById);
  });

  it('should add items length on progress if business is near and return PENDING', async () => {
    const fakeRequest = makeRequest(mockedProgress, [mockedProduct, mockedProduct]);

    const result = await sut.handle(fakeRequest);

    expect(updateActiveChallenge.updateActiveChallenge).toHaveBeenCalledWith({
      activeChallengeId: 'any-id',
      progress: 3,
      status: 'PENDING',
    });
    expect(result.status).toEqual('PENDING');
  });

  it('should return COMPLETED when progress was equal goal', async () => {
    const fakeRequest = makeRequest(3, [mockedProduct, mockedProduct]);

    const result = await sut.handle(fakeRequest);

    expect(updateActiveChallenge.updateActiveChallenge).toHaveBeenCalledWith({
      activeChallengeId: 'any-id',
      progress: 5,
      status: 'COMPLETED',
    });

    expect(result.status).toEqual('COMPLETED');
  });

  it('should not add items length on progress if business is near and return PENDING', async () => {
    const fakeRequest = makeRequest(mockedProgress, [mockedProduct, mockedProduct]);
    fakeRequest.orderInfos.latitude = 500;
    fakeRequest.orderInfos.longitude = 500;

    const result = await sut.handle(fakeRequest);

    expect(updateActiveChallenge.updateActiveChallenge).toHaveBeenCalledWith({
      activeChallengeId: 'any-id',
      progress: 1,
      status: 'PENDING',
    });
    expect(result.status).toEqual('PENDING');
  });
});
