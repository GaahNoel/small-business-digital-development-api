import { UpdateActiveChallenge } from '@/domain/usecases/challenge/update-active-challenge';
import { ListAccountOrders } from '@/domain/usecases/order';
import { BuyBackStrategy } from '@/presentation/strategies';

describe('BuyBackStrategy', () => {
  let sut: BuyBackStrategy;
  let updateActiveChallenge: UpdateActiveChallenge;
  let listAccountOrders: ListAccountOrders;

  const mockOrders = (businessId: string = 'any_business_id') => ([
    {
      id: 'any_id',
      status: 'PENDING' as 'PENDING',
      items: [
        {
          id: expect.any(String),
          quantity: 1,
          product: {
            id: 'any_product_id',
            name: 'any_product_name',
            description: 'any_product_description',
            salePrice: 11111,
            listPrice: 11111,
            imageUrl: 'any_image_url',
          },
        },
      ],
      total: 0,
      sellerId: 'any_seller_id',
      buyerId: 'any_buyer_id',
      updatedAt: expect.any(Date),
      createdAt: expect.any(Date),
      Business: {
        id: businessId,
        name: 'any_business_name',
      },
    },
  ]);

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
      businessId: 'new-business-id',
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

    listAccountOrders = {
      listAccountOrders: jest.fn(async () => Promise.resolve(mockOrders())),
    };
  });

  beforeEach(() => {
    sut = new BuyBackStrategy(updateActiveChallenge, listAccountOrders);
  });

  it('should call listAccountOrders', async () => {
    await sut.handle(makeRequest(1, [mockedProduct]));
    expect(listAccountOrders.listAccountOrders).toHaveBeenCalledTimes(1);
  });

  it('should return PENDING and not increment progress if order is on new business', async () => {
    const result = await sut.handle(makeRequest(1, [mockedProduct]));

    expect(updateActiveChallenge.updateActiveChallenge).toHaveBeenCalledWith({
      activeChallengeId: 'any-id',
      progress: 1,
      status: 'PENDING',
    });
    expect(result.status).toEqual('PENDING');
  });

  it('should return PENDING and increment progress if order is on recurrent business', async () => {
    (listAccountOrders.listAccountOrders as jest.Mock).mockImplementationOnce(async () => Promise.resolve(mockOrders('new-business-id')));
    const result = await sut.handle(makeRequest(1, [mockedProduct]));

    expect(updateActiveChallenge.updateActiveChallenge).toHaveBeenCalledWith({
      activeChallengeId: 'any-id',
      progress: 2,
      status: 'PENDING',
    });
    expect(result.status).toEqual('PENDING');
  });

  it('should return COMPLETED and increment progress if order is on recurrent business', async () => {
    (listAccountOrders.listAccountOrders as jest.Mock).mockImplementationOnce(async () => Promise.resolve(mockOrders('new-business-id')));
    const result = await sut.handle(makeRequest(4, [mockedProduct]));

    expect(updateActiveChallenge.updateActiveChallenge).toHaveBeenCalledWith({
      activeChallengeId: 'any-id',
      progress: 5,
      status: 'COMPLETED',
    });
    expect(result.status).toEqual('COMPLETED');
  });

  it('should throw error if listAccountOrders throws', async () => {
    (listAccountOrders.listAccountOrders as jest.Mock).mockImplementationOnce(async () => Promise.reject(new Error()));

    const promise = sut.handle(makeRequest(4, [mockedProduct]));
    await expect(promise).rejects.toThrow();
  });

  it('should throw error if updateActiveChallenge throws', async () => {
    (updateActiveChallenge.updateActiveChallenge as jest.Mock).mockImplementationOnce(async () => Promise.reject(new Error()));

    const promise = sut.handle(makeRequest(4, [mockedProduct]));
    await expect(promise).rejects.toThrow();
  });
});
