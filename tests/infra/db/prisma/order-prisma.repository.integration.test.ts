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

  beforeAll(async () => {
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
        total: 0,
        businessId: addedBusiness.id,
        buyerId: addedBuyerAccount.id,
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
        total: 0,
        businessId: addedBusiness.id,
        buyerId: addedBuyerAccount.id,
      });

      const result = await sut.getOrderById({ orderId: order.orderId });

      expect(result).toEqual({
        id: order.orderId,
        status: 'PENDING',
        items: [
          {
            quantity: 1,
            productId: addedProduct.productId,
            id: expect.any(String),
          },
        ],
        total: 0,
        sellerId: addedSellerAccount.id,
        businessId: addedBusiness.id,
        buyerId: addedBuyerAccount.id,
      });
    });
  });

  describe('updateOrderById', () => {
    it('should update order by id successfully', async () => {
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
      });

      const result = await sut.updateOrderById({
        orderId: order.orderId,
        status: 'COMPLETED',
      });

      expect(result).toEqual({
        orderId: order.orderId,
        status: 'COMPLETED',
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
      });

      const result = await sut.listAccountOrders({ accountId: addedBuyerAccount.id, type: 'sell' });

      expect(result).toEqual([]);
    });
  });
});
