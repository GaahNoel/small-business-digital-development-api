import { ListAccountOrdersRepository } from '@/data/protocols/db/order/list-account-orders.repository';
import { DbListAccountOrders } from '@/data/usecases/order';

describe('ListAccountOrders', () => {
  const request = {
    accountId: 'any_account_id',
    type: 'buy' as 'buy',
  };

  let sut: DbListAccountOrders;
  let listAccountOrdersRepository: ListAccountOrdersRepository;

  const mockedRepositoryResult = {
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
    Business: {
      id: 'any_business_id',
      name: 'any_business_name',
    },
    buyerId: 'any_buyer_id',
    updatedAt: expect.any(Date),
    createdAt: expect.any(Date),
  };

  beforeAll(() => {
    listAccountOrdersRepository = {
      listAccountOrders: jest.fn(async () => Promise.resolve([
        mockedRepositoryResult,
      ])),
    };
  });

  beforeEach(() => {
    sut = new DbListAccountOrders(listAccountOrdersRepository);
  });

  it('should call ListAccountOrdersRepository with correct values', async () => {
    await sut.listAccountOrders(request);
    expect(listAccountOrdersRepository.listAccountOrders).toHaveBeenCalledWith({
      accountId: request.accountId,
      type: request.type,
    });
  });

  it('should return a list of orders on success', async () => {
    const response = await sut.listAccountOrders(request);
    expect(response).toEqual([mockedRepositoryResult]);
  });
});
