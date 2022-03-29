import { DbAddAccount } from '@/data/usecases/account/db-add-account';
import { BcryptAdapter } from '@/infra/cryptography';
import { AccountPrismaRepository } from '@/infra/db/prisma/account/account-prisma.repository';
import { env } from '@/main/config/env';
import { SignUpController } from '@/presentation/controller/account/signup.controller';
import { BaseController } from '@/presentation/protocols';

export const makeSignUpController = (): BaseController => {
  const salt = 12;
  // Infra
  const addAccountRepository = new AccountPrismaRepository();
  const findAccountByEmailRepository = new AccountPrismaRepository();

  const hasher = new BcryptAdapter(salt);

  // Data
  const addAccount = new DbAddAccount(addAccountRepository, findAccountByEmailRepository, hasher);

  // Presentation
  return new SignUpController(addAccount);
};
