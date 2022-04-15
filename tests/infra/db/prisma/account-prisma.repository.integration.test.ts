import { mockAddAccountParams } from '@/tests/domain/mocks/account.mock';
import { AccountPrismaRepository } from '@/infra/db/prisma/account/account-prisma.repository';
import { prisma } from '@/infra/db/helpers';

const makeSut = (): AccountPrismaRepository => new AccountPrismaRepository();

describe('AccountPrismaRepository', () => {
  beforeEach(async () => {
    await prisma.business.deleteMany({});
    await prisma.account.deleteMany({});
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

  it('should return account on add success ', async () => {
    const sut = makeSut();

    const httpRequest = mockAddAccountParams();
    const account = await sut.add(httpRequest);

    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
  });

  it('should return existent account by email', async () => {
    const sut = makeSut();

    const httpRequest = mockAddAccountParams();
    const addedAccount = await sut.add(httpRequest);
    const foundAccount = await sut.findByEmail({ email: httpRequest.email });

    delete foundAccount.createdAt;
    expect(foundAccount.id).toEqual(addedAccount.id);
  });

  it('should verify account by id', async () => {
    const sut = makeSut();

    const httpRequest = mockAddAccountParams();
    const { id } = await sut.add(httpRequest);
    const verified = await sut.verify(id);

    expect(verified).toBe(true);
  });
});
