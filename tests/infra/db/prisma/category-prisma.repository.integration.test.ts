import { mockAddCategoryParams } from '@/tests/domain/mocks/category.mock';
import { prisma } from '@/infra/db/helpers';
import { CategoryPrismaRepository } from '@/infra/db/prisma/category';

const makeSut = () => {
  const sut = new CategoryPrismaRepository();
  return {
    sut,
  };
};

describe('CategoryPrismaRepository', () => {
  beforeEach(async () => {
    await prisma.category.deleteMany({});
  });

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
  describe('add', () => {
    it('should add a new category', async () => {
      const { sut } = makeSut();

      const response = await sut.add(mockAddCategoryParams());

      expect(response).toEqual({
        id: expect.anything(),
        createdAt: expect.anything(),
        ...mockAddCategoryParams(),
      });
    });

    it('should throw error if prisma throws', () => {
      const { sut } = makeSut();

      jest.spyOn(prisma.category, 'create').mockRejectedValueOnce(new Error());

      const promise = sut.add(mockAddCategoryParams());

      expect(promise).rejects.toThrow();
    });
  });

  describe('list', () => {
    it('should return a list of categories', async () => {
      const { sut } = makeSut();

      await prisma.category.create({
        data: {
          ...mockAddCategoryParams(),
        },
      });

      await prisma.category.create({
        data: {
          ...mockAddCategoryParams(),
        },
      });

      const response = await sut.list();

      expect(response).toEqual([
        {
          id: expect.anything(),
          createdAt: expect.anything(),
          ...mockAddCategoryParams(),
        },
        {
          id: expect.anything(),
          createdAt: expect.anything(),
          ...mockAddCategoryParams(),
        },
      ]);
    });
  });
});
