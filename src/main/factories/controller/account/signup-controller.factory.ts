import { DbAddAccount } from '@/data/usecases/account/db-add-account';
import { BcryptAdapter } from '@/infra/cryptography';
import { AccountPrismaRepository } from '@/infra/db/prisma/account/account-prisma.repository';
import { NodeMailerAdapter } from '@/infra/email/nodemailer-adapter';
import { env } from '@/main/config/env';
import { SignUpController } from '@/presentation/controller/account/signup.controller';
import { BaseController } from '@/presentation/protocols';

export const makeSignUpController = (): BaseController => {
  const salt = 12;
  // Infra
  const addAccountRepository = new AccountPrismaRepository();
  const findAccountByEmailRepository = new AccountPrismaRepository();
  const emailVerificationSender = new NodeMailerAdapter(
    env.emailAccount,
    env.emailAccount,
    env.emailPassword,
    'smtp.gmail.com',
    465,
    true,
  );
  const hasher = new BcryptAdapter(salt);

  // Data
  const addAccount = new DbAddAccount(
    addAccountRepository,
    findAccountByEmailRepository,
    emailVerificationSender,
    hasher,
  );

  // Presentation
  return new SignUpController(addAccount);
};
