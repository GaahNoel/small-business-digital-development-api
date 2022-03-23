import { mockAddAccountParams } from '@/tests/domain/mocks/account.mock';
import { AccountPrismaRepository } from '@/infra/db/prisma/account/account-prisma.repository';
import { prisma } from '@/infra/db/helpers';

const makeSut = (): AccountPrismaRepository => new AccountPrismaRepository();

describe('AccountPrismaRepository', () => {
  beforeEach(async () => {
    await prisma.account.deleteMany({});
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
    const foundAccount = await sut.findByEmail(httpRequest.email);

    delete foundAccount.createdAt;
    expect(foundAccount).toEqual(addedAccount);
  });
});
