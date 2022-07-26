import { OrderPrismaRepository } from '@/infra/db/prisma/order';
import { mockAddAccountParams } from '@/tests/domain/mocks/account.mock';
import { AccountPrismaRepository } from '@/infra/db/prisma/account';
import { BusinessPrismaRepository } from '@/infra/db/prisma/business';
import { mockAddBusinessParams } from '@/tests/domain/mocks/business.mock';
import {
  AddAccountRepository, AddBusinessRepository, AddCategoryRepository, AddProductRepository,
} from '@/data';
import { prisma } from '@/infra/db/helpers';
import { ProductPrismaRepository } from '@/infra/db/prisma/product';
import { mockAddProductParams } from '@/tests/domain/mocks/product.mock';
import { CategoryPrismaRepository } from '@/infra/db/prisma/category';
import { mockAddCategoryParams } from '@/tests/domain/mocks/category.mock';

jest.setTimeout(30000);
describe('OrderPrismaRepository', () => {
  let sut: OrderPrismaRepository;
  let addedSellerAccount: AddAccountRepository.Result;
  let addedBuyerAccount: AddAccountRepository.Result;
  let addedBusiness: AddBusinessRepository.Result;
  let addedProduct: AddProductRepository.Result;
  let addedCategory: AddCategoryRepository.Result;
  let accountPrismaRepository : AccountPrismaRepository;
  let businessPrismaRepository : BusinessPrismaRepository;
  let productPrismaRepository : ProductPrismaRepository;
  let categoryPrismaRepository: CategoryPrismaRepository;

  const baseCreatePayload = {
    description: 'test',
    paymentMethod: 'CreditCard' as 'CreditCard',
    change: 0,
    total: 0,
    latitude: 10,
    longitude: 10,
  };

  beforeAll(async () => {
    await prisma.activeChallenge.deleteMany({});
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.business.deleteMany({});
    await prisma.account.deleteMany({});

    accountPrismaRepository = new AccountPrismaRepository();
    businessPrismaRepository = new BusinessPrismaRepository();
    productPrismaRepository = new ProductPrismaRepository();
    categoryPrismaRepository = new CategoryPrismaRepository();

    addedSellerAccount = await accountPrismaRepository.add(mockAddAccountParams());
    addedBuyerAccount = await accountPrismaRepository.add(mockAddAccountParams('other_email'));

    addedBusiness = await businessPrismaRepository.add(mockAddBusinessParams(addedSellerAccount.id));

    addedCategory = await categoryPrismaRepository.add(mockAddCategoryParams());

    addedProduct = await productPrismaRepository.add(mockAddProductParams(addedBusiness.id, addedCategory.id));
  });

  beforeEach(async () => {
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});

    sut = new OrderPrismaRepository();
  });

  describe('create', () => {
    it('should create order successfully', async () => {
      const order = await sut.create({
        items: [
          {
            quantity: 1,
            productId: addedProduct.productId,
          },
        ],
        sellerId: addedSellerAccount.id,
        businessId: addedBusiness.id,
        buyerId: addedBuyerAccount.id,
        ...baseCreatePayload,
      });

      expect(order).toEqual({
        orderId: expect.any(String),
      });
    });

    it('should create order successfully without latitude and longitude', async () => {
      const order = await sut.create({
        items: [
          {
            quantity: 1,
            productId: addedProduct.productId,
          },
        ],
        sellerId: addedSellerAccount.id,
        businessId: addedBusiness.id,
        buyerId: addedBuyerAccount.id,
        ...baseCreatePayload,
        latitude: undefined,
        longitude: undefined,
      });

      expect(order).toEqual({
        orderId: expect.any(String),
      });
    });
  });

  describe('getOrderById', () => {
    it('should get order by id successfully', async () => {
      const order = await sut.create({
        items: [
          {
            quantity: 1,
            productId: addedProduct.productId,
          },
        ],
        sellerId: addedSellerAccount.id,
        businessId: addedBusiness.id,
        buyerId: addedBuyerAccount.id,
        ...baseCreatePayload,
      });

      const result = await sut.getOrderById({ orderId: order.orderId });

      expect(result).toEqual({
        id: order.orderId,
        status: 'PENDING',
        items: [
          {
            quantity: 1,
            product: {
              id: addedProduct.productId,
              type: mockAddProductParams(addedBusiness.id, addedCategory.id).type,
              name: mockAddProductParams(addedBusiness.id, addedCategory.id).name,
              description: mockAddProductParams(addedBusiness.id, addedCategory.id).description,
              salePrice: mockAddProductParams(addedBusiness.id, addedCategory.id).salePrice,
              listPrice: mockAddProductParams(addedBusiness.id, addedCategory.id).listPrice,
              imageUrl: mockAddProductParams(addedBusiness.id, addedCategory.id).imageUrl,
            },
            id: expect.any(String),
          },
        ],
        ...baseCreatePayload,
        sellerId: addedSellerAccount.id,
        businessId: addedBusiness.id,
        buyerId: addedBuyerAccount.id,
        sellerStatus: 'PENDING',
        buyerStatus: 'PENDING',
        latitude: '10',
        longitude: '10',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });

  describe('updateOrderById', () => {
    it('should update order by id successfully when is statusType order', async () => {
      const order = await sut.create({
        items: [
          {
            quantity: 1,
            productId: addedProduct.productId,
          },
        ],
        sellerId: addedSellerAccount.id,
        businessId: addedBusiness.id,
        buyerId: addedBuyerAccount.id,
        ...baseCreatePayload,
      });

      await sut.updateOrderById({
        orderId: order.orderId,
        status: 'COMPLETED',
        statusType: 'seller',
      });

      await sut.updateOrderById({
        orderId: order.orderId,
        status: 'COMPLETED',
        statusType: 'buyer',
      });

      const result = await sut.updateOrderById({
        orderId: order.orderId,
        status: 'COMPLETED',
        statusType: 'order',
      });

      expect(result).toEqual({
        orderId: order.orderId,
        status: 'COMPLETED',
        total: 0,
        buyerStatus: 'COMPLETED',
        sellerStatus: 'COMPLETED',
      });
    });

    it('should update order by id successfully when is statusType buyer', async () => {
      const order = await sut.create({
        items: [
          {
            quantity: 1,
            productId: addedProduct.productId,
          },
        ],
        sellerId: addedSellerAccount.id,
        businessId: addedBusiness.id,
        buyerId: addedBuyerAccount.id,
        ...baseCreatePayload,
      });

      const result = await sut.updateOrderById({
        orderId: order.orderId,
        status: 'COMPLETED',
        statusType: 'buyer',
      });

      expect(result).toEqual({
        orderId: order.orderId,
        status: 'PENDING',
        buyerStatus: 'COMPLETED',
        sellerStatus: 'PENDING',
        total: 0,
      });
    });

    it('should update order by id successfully when is statusType seller', async () => {
      const order = await sut.create({
        items: [
          {
            quantity: 1,
            productId: addedProduct.productId,
          },
        ],
        sellerId: addedSellerAccount.id,
        businessId: addedBusiness.id,
        buyerId: addedBuyerAccount.id,
        ...baseCreatePayload,
      });

      const result = await sut.updateOrderById({
        orderId: order.orderId,
        status: 'COMPLETED',
        statusType: 'seller',
      });

      expect(result).toEqual({
        orderId: order.orderId,
        status: 'PENDING',
        buyerStatus: 'PENDING',
        sellerStatus: 'COMPLETED',
        total: 0,
      });
    });
  });

  describe('ListAccountOrders', () => {
    it('should get buy orders by account id successfully', async () => {
      const mockedAddProductParams = mockAddProductParams(addedBusiness.id, addedCategory.id);
      const mockedAddBusinessParams = mockAddBusinessParams(addedSellerAccount.id);

      const order = await sut.create({
        items: [
          {
            quantity: 1,
            productId: addedProduct.productId,
          },
        ],
        sellerId: addedSellerAccount.id,
        total: 0,
        businessId: addedBusiness.id,
        buyerId: addedBuyerAccount.id,
        ...baseCreatePayload,
      });

      const result = await sut.listAccountOrders({ accountId: addedBuyerAccount.id, type: 'buy' });

      expect(result).toEqual([
        {
          id: order.orderId,
          status: 'PENDING',
          items: [
            {
              id: expect.any(String),
              quantity: 1,
              product: {
                id: addedProduct.productId,
                name: mockedAddProductParams.name,
                description: mockedAddProductParams.description,
                salePrice: mockedAddProductParams.salePrice,
                listPrice: mockedAddProductParams.listPrice,
                imageUrl: mockedAddProductParams.imageUrl,
              },
            },
          ],
          total: 0,
          sellerId: addedSellerAccount.id,
          Business: {
            id: addedBusiness.id,
            name: mockedAddBusinessParams.name,
          },
          buyerId: addedBuyerAccount.id,
          updatedAt: expect.any(Date),
          createdAt: expect.any(Date),
        },
      ]);
    });
    it('should get sell orders by account id successfully', async () => {
      const mockedAddProductParams = mockAddProductParams(addedBusiness.id, addedCategory.id);
      const mockedAddBusinessParams = mockAddBusinessParams(addedSellerAccount.id);

      const order = await sut.create({
        items: [
          {
            quantity: 1,
            productId: addedProduct.productId,
          },
        ],
        sellerId: addedSellerAccount.id,
        total: 0,
        businessId: addedBusiness.id,
        buyerId: addedBuyerAccount.id,
        ...baseCreatePayload,
      });

      const result = await sut.listAccountOrders({ accountId: addedSellerAccount.id, type: 'sell' });

      expect(result).toEqual([
        {
          id: order.orderId,
          status: 'PENDING',
          items: [
            {
              id: expect.any(String),
              quantity: 1,
              product: {
                id: addedProduct.productId,
                name: mockedAddProductParams.name,
                description: mockedAddProductParams.description,
                salePrice: mockedAddProductParams.salePrice,
                listPrice: mockedAddProductParams.listPrice,
                imageUrl: mockedAddProductParams.imageUrl,
              },
            },
          ],
          total: 0,
          sellerId: addedSellerAccount.id,
          Business: {
            id: addedBusiness.id,
            name: mockedAddBusinessParams.name,
          },
          buyerId: addedBuyerAccount.id,
          updatedAt: expect.any(Date),
          createdAt: expect.any(Date),
        },
      ]);
    });

    it('should return empty array if no order was found', async () => {
      await sut.create({
        items: [
          {
            quantity: 1,
            productId: addedProduct.productId,
          },
        ],
        sellerId: addedSellerAccount.id,
        total: 0,
        businessId: addedBusiness.id,
        buyerId: addedBuyerAccount.id,
        ...baseCreatePayload,
      });

      const result = await sut.listAccountOrders({ accountId: addedBuyerAccount.id, type: 'sell' });

      expect(result).toEqual([]);
    });
  });
});
