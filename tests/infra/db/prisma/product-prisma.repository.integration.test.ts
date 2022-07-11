import { mockAddProductParams } from '@/tests/domain/mocks/product.mock';
import { prisma } from '@/infra/db/helpers';
import { ProductPrismaRepository } from '@/infra/db/prisma/product';
import { mockAddCategoryParams } from '@/tests/domain/mocks/category.mock';
import { AccountPrismaRepository } from '@/infra/db/prisma/account';
import { BusinessPrismaRepository } from '@/infra/db/prisma/business';
import { CategoryPrismaRepository } from '@/infra/db/prisma/category';
import { mockAddAccountParams } from '@/tests/domain/mocks/account.mock';
import { mockAddBusinessParams } from '@/tests/domain/mocks/business.mock';

const addAccountRepository = new AccountPrismaRepository();
const addBusinessRepository = new BusinessPrismaRepository();
const addCategoryRepository = new CategoryPrismaRepository();

const makeSut = () => {
  const sut = new ProductPrismaRepository();

  return {
    sut,
  };
};

const mockCategory = { id: 'any_id' };
const mockBusiness = { id: 'any_id' };

describe('ProductPrismaRepository', () => {
  beforeAll(async () => {
    const deleteOrderItems = prisma.orderItem.deleteMany();
    const deleteOrders = prisma.order.deleteMany();
    const deleteProduct = prisma.product.deleteMany();
    const deleteCategory = prisma.category.deleteMany();
    const deleteBusiness = prisma.business.deleteMany();
    const deleteAccount = prisma.account.deleteMany();

    await prisma.$transaction([
      deleteOrderItems,
      deleteOrders,
      deleteProduct,
      deleteCategory,
      deleteBusiness,
      deleteAccount,
    ]);

    prisma.$disconnect();
  });

  beforeAll(async () => {
    const account = await addAccountRepository.add(mockAddAccountParams());
    const business = await addBusinessRepository.add(mockAddBusinessParams(account.id));
    const category = await addCategoryRepository.add(mockAddCategoryParams());

    mockBusiness.id = business.id;
    mockCategory.id = category.id;
  });

  beforeEach(async () => {
    await prisma.product.deleteMany({});
  });
  describe('add', () => {
    it('should add a new Product', async () => {
      const { sut } = makeSut();

      const response = await sut.add(mockAddProductParams(mockBusiness.id, mockCategory.id));

      expect(response).toEqual({
        productId: expect.anything(),
      });
    });
  });

  describe('list', () => {
    it('should list all products from business', async () => {
      const { sut } = makeSut();
      const mockedProduct = mockAddProductParams(mockBusiness.id, mockCategory.id);

      await sut.add(mockedProduct);

      const response = await sut.list({
        businessId: mockBusiness.id,
      });

      delete mockedProduct.categoryId;

      expect(response).toEqual([{
        id: expect.any(String),
        ...mockedProduct,
        category: {
          id: mockCategory.id,
          name: 'any_name',
        },
      }]);
    });
  });

  describe('delete', () => {
    it('should delete a product', async () => {
      const { sut } = makeSut();

      const addedProduct = await sut.add(mockAddProductParams(mockBusiness.id, mockCategory.id));

      const response = await sut.delete({
        productId: addedProduct.productId,
      });

      expect(response).toEqual({
        id: addedProduct.productId,
      });
    });
  });
  describe('edit', () => {
    it('should edit a product', async () => {
      const { sut } = makeSut();

      const addedProduct = await sut.add(mockAddProductParams(mockBusiness.id, mockCategory.id));

      const response = await sut.edit({
        productId: addedProduct.productId,
        name: 'any_name',
        description: 'any_description',
        listPrice: 10,
        salePrice: 20,
        imageUrl: 'any_image_url',
      });

      expect(response).toEqual({
        productId: addedProduct.productId,
      });
    });
  });

  describe('get', () => {
    it('should get a product', async () => {
      const { sut } = makeSut();
      const mockedProduct = mockAddProductParams(mockBusiness.id, mockCategory.id);

      const addedProduct = await sut.add(mockedProduct);

      const response = await sut.get({
        productId: addedProduct.productId,
      });

      delete mockedProduct.categoryId;

      expect(response).toEqual({
        ...mockedProduct,
        category: {
          id: mockCategory.id,
          name: 'any_name',
        },
      });
    });
  });

  it('should return null if product not found', async () => {
    const { sut } = makeSut();

    const response = await sut.get({
      productId: 'any_id',
    });

    expect(response).toBeNull();
  });

  describe('listProductsByBusinesses', () => {
    it('should list all products from businesses', async () => {
      const { sut } = makeSut();
      const mockedProduct = mockAddProductParams(mockBusiness.id, mockCategory.id);

      await sut.add(mockedProduct);

      const response = await sut.listProductsByBusinesses({
        businessesIds: [mockBusiness.id],
        type: 'product' as 'product' | 'service',
      });

      delete mockedProduct.categoryId;
      delete mockedProduct.businessId;

      expect(response).toEqual([{
        id: expect.any(String),
        ...mockedProduct,
        business: {
          id: mockBusiness.id,
          name: 'any_name',
          latitude: 'any_latitude',
          longitude: 'any_longitude',
        },
        category: {
          id: mockCategory.id,
          name: 'any_name',
        },
        createdAt: expect.any(Date),
      }]);
    });
  });
});
