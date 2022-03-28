import { DbAddAccount } from '@/data/usecases/account/db-add-account';
import { AccountPrismaRepository } from '@/infra/db/prisma/account/account-prisma.repository';
import { SignUpController } from '@/presentation/controller/account/signup.controller';
import { BaseController } from '@/presentation/protocols';

export const makeSignUpController = (): BaseController => {
  // Infra
  const addAccountRepository = new AccountPrismaRepository();
  const findAccountByEmailRepository = new AccountPrismaRepository();

  // Data
  const addAccount = new DbAddAccount(addAccountRepository, findAccountByEmailRepository);

  // Presentation
  return new SignUpController(addAccount);
};
