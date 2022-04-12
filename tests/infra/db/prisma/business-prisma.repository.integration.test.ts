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
  beforeAll(async () => {
    await prisma.product.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.business.deleteMany({});
    await prisma.account.deleteMany({});
  });

  beforeEach(async () => {
    await prisma.business.deleteMany({});
    await prisma.account.deleteMany({});
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

    expect(result).toEqual([
      {
        id: addedBusiness.id,
        name: business.name,
        description: business.description,
        imageUrl: business.imageUrl,
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
