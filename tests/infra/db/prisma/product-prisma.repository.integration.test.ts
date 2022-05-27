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
  afterAll(async () => {
    const deleteProduct = prisma.product.deleteMany();
    const deleteCategory = prisma.category.deleteMany();
    const deleteBusiness = prisma.business.deleteMany();
    const deleteAccount = prisma.account.deleteMany();

    await prisma.$transaction([
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
        ...mockAddProductParams(),
        id: expect.anything(),
        createdAt: expect.anything(),
        businessId: mockBusiness.id,
        categoryId: mockCategory.id,
      });
    });
  });

  describe('list', () => {
    it('should list all products from business', async () => {
      const { sut } = makeSut();

      const addedProduct = await sut.add(mockAddProductParams(mockBusiness.id, mockCategory.id));

      const response = await sut.list({
        businessId: mockBusiness.id,
      });

      expect(response).toEqual([{
        ...addedProduct,
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
        productId: addedProduct.id,
      });

      expect(response).toEqual({
        id: addedProduct.id,
      });
    });
  });
  describe('edit', () => {
    it('should edit a product', async () => {
      const { sut } = makeSut();

      const addedProduct = await sut.add(mockAddProductParams(mockBusiness.id, mockCategory.id));

      const response = await sut.edit({
        productId: addedProduct.id,
        name: 'any_name',
        description: 'any_description',
        listPrice: 10,
        salePrice: 20,
        imageUrl: 'any_image_url',
      });

      expect(response).toEqual({
        productId: addedProduct.id,
      });
    });
  });
});
