import { mockAddAccountParams } from '@/domain/test/account.mock';
import { AccountPostgresRepository } from './account-postgres.repository';
import { prisma } from './account-postgres.repository.protocols';

const makeSut = (): AccountPostgresRepository => new AccountPostgresRepository();

describe('AccountPostgresRepository', () => {
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
});
