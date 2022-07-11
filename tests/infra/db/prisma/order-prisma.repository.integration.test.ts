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
        total: 0,
        businessId: addedBusiness.id,
        buyerId: addedBuyerAccount.id,
      });

      expect(order).toEqual({
        orderId: expect.any(String),
      });
    });
  });
});
