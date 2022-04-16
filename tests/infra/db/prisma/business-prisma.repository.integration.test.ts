import { AddBusinessRepository } from '@/data/protocols/db/business/add-business.repository';
import { mockAddBusinessParams } from '@/tests/domain/mocks/business.mock';
import { BusinessPrismaRepository } from '@/infra/db/prisma/business';
import { prisma } from '@/infra/db/helpers';
import { mockAddAccountParams } from '@/tests/domain/mocks/account.mock';
import { AccountPrismaRepository } from '@/infra/db/prisma/account';
import { ListBusinessFromAccount } from '@/domain/usecases/business';

type SutTypes = {
  sut: AddBusinessRepository & ListBusinessFromAccount;
  addAccountRepository: AccountPrismaRepository;
};

const makeSut = (): SutTypes => {
  const sut = new BusinessPrismaRepository();
  const addAccountRepository = new AccountPrismaRepository();
  return {
    sut,
    addAccountRepository,
  };
};

describe('BusinessPrismaRepository', () => {
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
  it('should return business on add success ', async () => {
    const { sut, addAccountRepository } = makeSut();
    const account = mockAddAccountParams();
    const addedAccount = await addAccountRepository.add(account);

    const business = mockAddBusinessParams(addedAccount.id);
    const result = await sut.add(business);
    expect(result).toEqual({
      id: expect.anything(),
      createdAt: expect.anything(),
      ...business,
    });
  });

  it('should list all business from accountId', async () => {
    const { sut, addAccountRepository } = makeSut();
    const account = mockAddAccountParams();

    const addedAccount = await addAccountRepository.add(account);

    const business = mockAddBusinessParams(addedAccount.id);
    const addedBusiness = await sut.add(business);

    const result = await sut.list({
      accountId: addedAccount.id,
    });

    const { accountId, ...rest } = business;

    expect(result).toEqual([
      {
        ...rest,
        id: addedBusiness.id,
        createdAt: expect.anything(),
      },
    ]);
  });

  it('should return empty list accountId not have business', async () => {
    const { sut, addAccountRepository } = makeSut();
    const account = mockAddAccountParams();

    const addedAccount = await addAccountRepository.add(account);

    const result = await sut.list({
      accountId: addedAccount.id,
    });

    expect(result).toEqual([]);
  });

  it('should return empty list if accountId not exists', async () => {
    const { sut } = makeSut();

    const result = await sut.list({
      accountId: 'invalid-id',
    });

    expect(result).toEqual([]);
  });
});
