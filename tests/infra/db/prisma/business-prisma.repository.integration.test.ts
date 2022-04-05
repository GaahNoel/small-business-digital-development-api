import { AddBusinessRepository } from '@/data/protocols/db/business/add-business.repository';
import { mockAddBusinessParams } from '@/tests/domain/mocks/business.mock';
import { BusinessPrismaRepository } from '@/infra/db/prisma/business';
import { prisma } from '@/infra/db/helpers';
import { mockAddAccountParams } from '@/tests/domain/mocks/account.mock';
import { AccountPrismaRepository } from '@/infra/db/prisma/account';

type SutTypes = {
  sut: AddBusinessRepository;
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
});
