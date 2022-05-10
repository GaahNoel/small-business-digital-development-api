import { EmailVerifyAccount } from '@/data/usecases/account/email-verify-account';
import { AccountPrismaRepository } from '@/infra';
import { JwtAdapter } from '@/infra/cryptography';
import { env } from '@/main/config/env';
import { VerifyAccountController } from '@/presentation/controller/account/verify-account.controller';
import { BaseController } from '@/presentation/protocols';

export const makeVerifyAccountController = (): BaseController => {
  const verifyAccountRepository = new AccountPrismaRepository();
  const encrypter = new JwtAdapter(env.jwtSecret);

  const addAccount = new EmailVerifyAccount(
    verifyAccountRepository,
    encrypter,
  );

  return new VerifyAccountController(addAccount);
};
