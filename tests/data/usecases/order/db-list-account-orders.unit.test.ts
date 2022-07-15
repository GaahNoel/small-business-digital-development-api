import { ListAccountOrdersRepository } from '@/data/protocols/db/order/list-account-orders.repository';
import { DbListAccountOrders } from '@/data/usecases/order';

describe('ListAccountOrders', () => {
  const request = {
    accountId: 'any_account_id',
    type: 'buy' as 'buy',
  };

  let sut: DbListAccountOrders;
  let listAccountOrdersRepository: ListAccountOrdersRepository;

  beforeAll(() => {
    listAccountOrdersRepository = {
      listAccountOrders: jest.fn(async () => Promise.resolve([{
        id: 'any_id',
        status: 'PENDING' as 'PENDING',
        total: 100,
        businessId: 'any_business_id',
        buyerId: 'any_buyer_id',
        sellerId: 'any_seller_id',
        items: [],
      }])),
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
    expect(response).toEqual([{
      id: 'any_id',
      status: 'PENDING',
      total: 100,
      businessId: 'any_business_id',
      buyerId: 'any_buyer_id',
      sellerId: 'any_seller_id',
      items: [],
    }]);
  });
});
