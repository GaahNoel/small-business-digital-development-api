import { EmailVerifyAccount } from '@/data/usecases/account/email-verify-account';
import { AccountPrismaRepository } from '@/infra';
import { VerifyAccountController } from '@/presentation/controller/account/verify-account.controller';
import { BaseController } from '@/presentation/protocols';

export const makeVerifyAccountController = (): BaseController => {
  const verifyAccountRepository = new AccountPrismaRepository();

  const addAccount = new EmailVerifyAccount(
    verifyAccountRepository,
  );

  return new VerifyAccountController(addAccount);
};
