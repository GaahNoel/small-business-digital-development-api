import { DbAddAccount } from '@/data/usecases/account/add-account/db-add-account';
import { AccountPostgresRepository } from '@/infra/db/postgres/account/account-postgres.repository';
import { SignUpController } from '@/presentation/controller/account/signup/signup.controller';
import { BaseController } from '@/presentation/protocols';

export const makeSignUpController = (): BaseController => {
  // Infra
  const addAccountRepository = new AccountPostgresRepository();

  // Data
  const addAccount = new DbAddAccount(addAccountRepository);

  // Presentation
  return new SignUpController(addAccount);
};
