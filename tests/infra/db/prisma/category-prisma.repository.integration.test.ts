import { AddCategoryRepository } from '@/data/protocols/db/category';
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
  it('should add a new category', async () => {
    const { sut } = makeSut();

    const response = await sut.add(mockAddCategoryParams());

    expect(response).toEqual({
      id: expect.anything(),
      createdAt: expect.anything(),
      ...mockAddCategoryParams(),
    });
  });
});
