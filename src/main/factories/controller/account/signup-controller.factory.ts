import { DbAddAccount } from '@/data/usecases/account';
import { DbRenewAccountChallenges } from '@/data/usecases/challenge';
import { BcryptAdapter, JwtAdapter } from '@/infra/cryptography';
import { AccountPrismaRepository } from '@/infra/db/prisma/account/account-prisma.repository';
import { ChallengePrismaRepository } from '@/infra/db/prisma/challenge';
import { NodeMailerAdapter } from '@/infra/email/nodemailer-adapter';
import { env } from '@/main/config/env';
import { SignUpController } from '@/presentation/controller/account/signup.controller';
import { ErrorHandlerDecorator } from '@/presentation/decorators';
import { BaseController } from '@/presentation/protocols';

export const makeSignUpController = (): BaseController => {
  const salt = 12;

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
  const challengeRepository = new ChallengePrismaRepository();
  const hasher = new BcryptAdapter(salt);

  const encrypter = new JwtAdapter(env.jwtSecret);

  const addAccount = new DbAddAccount(
    addAccountRepository,
    findAccountByEmailRepository,
    emailVerificationSender,
    hasher,
    encrypter,
  );

  const renewAccountChallenges = new DbRenewAccountChallenges(challengeRepository, challengeRepository, challengeRepository);

  return new ErrorHandlerDecorator(new SignUpController(addAccount, renewAccountChallenges));
};
