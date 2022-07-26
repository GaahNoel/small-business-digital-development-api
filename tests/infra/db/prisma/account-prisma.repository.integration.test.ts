import { mockAddAccountParams, mockEditAccountParams } from '@/tests/domain/mocks/account.mock';
import { AccountPrismaRepository } from '@/infra/db/prisma/account/account-prisma.repository';
import { prisma } from '@/infra/db/helpers';

const makeSut = (): AccountPrismaRepository => new AccountPrismaRepository();

describe('AccountPrismaRepository', () => {
  beforeEach(async () => {
    await prisma.business.deleteMany({});
    await prisma.account.deleteMany({});
  });

  beforeAll(async () => {
    const deleteActiveChallenges = prisma.activeChallenge.deleteMany({});
    const deleteOrderItems = prisma.orderItem.deleteMany();
    const deleteOrders = prisma.order.deleteMany();
    const deleteProduct = prisma.product.deleteMany();
    const deleteCategory = prisma.category.deleteMany();
    const deleteBusiness = prisma.business.deleteMany();
    const deleteAccount = prisma.account.deleteMany();

    await prisma.$transaction([
      deleteActiveChallenges,
      deleteOrderItems,
      deleteOrders,
      deleteProduct,
      deleteCategory,
      deleteBusiness,
      deleteAccount,
    ]);

    await prisma.$disconnect();
  });
  describe('add', () => {
    it('should return account on add success ', async () => {
      const sut = makeSut();

      const request = mockAddAccountParams();
      const account = await sut.add(request);

      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
    });

    it('should use verified true if provided ', async () => {
      const sut = makeSut();

      const params = mockAddAccountParams();
      const account = await sut.add({
        ...params,
        verified: true,
      });

      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
    });
  });

  describe('findByEmail', () => {
    it('should return existent account by email', async () => {
      const sut = makeSut();

      const request = mockAddAccountParams();
      const addedAccount = await sut.add(request);
      const foundAccount = await sut.findByEmail({ email: request.email });

      delete foundAccount.createdAt;
      expect(foundAccount.id).toEqual(addedAccount.id);
    });
  });

  describe('verify', () => {
    it('should verify account by id', async () => {
      const sut = makeSut();

      const request = mockAddAccountParams();
      const { id } = await sut.add(request);
      const verified = await sut.verify(id);

      expect(verified).toBe(true);
    });
  });

  describe('edit', () => {
    it('should edit account if called with correct params', async () => {
      const sut = makeSut();

      const addRequest = mockAddAccountParams();
      const { id } = await sut.add(addRequest);

      const editRequest = mockEditAccountParams(id);
      const { id: editedAccountId } = await sut.edit(editRequest);

      expect(editedAccountId).toEqual(id);
    });
  });

  describe('getById', () => {
    it('should return account infos', async () => {
      const sut = makeSut();

      const request = mockAddAccountParams();
      const { id } = await sut.add(request);

      const account = await sut.getById({ accountId: id });

      expect(account.id).toEqual(id);
    });
  });

  describe('getAllAccountIds', () => {
    it('should return all account ids', async () => {
      const sut = makeSut();

      const request = mockAddAccountParams();
      const { id } = await sut.add(request);

      const { accountIds } = await sut.getAllAccountIds();

      expect(accountIds).toContain(id);
    });
  });
});
