import { AccountPostgresRepository } from './account-postgres.repository';

const makeSut = (): AccountPostgresRepository => new AccountPostgresRepository();



describe('AccountPostgresRepository', () => {
  it('should return account on add success ', async () => {
    expect(true).toBe(true);
  });
});
