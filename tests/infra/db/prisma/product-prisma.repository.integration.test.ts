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
    await prisma.product.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.business.deleteMany({});
    await prisma.account.deleteMany({});

    const account = await addAccountRepository.add(mockAddAccountParams());
    const business = await addBusinessRepository.add(mockAddBusinessParams(account.id));
    const category = await addCategoryRepository.add(mockAddCategoryParams());

    mockBusiness.id = business.id;
    mockCategory.id = category.id;
  });

  beforeEach(async () => {
    await prisma.product.deleteMany({});
  });
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