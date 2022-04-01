import { EmailVerifyAccount } from '@/data/usecases/account/email-verify-account';
import { AccountPrismaRepository } from '@/infra';
import { VerifyAccountController } from '@/presentation/controller/account/verifyAccount.controller';
import { BaseController } from '@/presentation/protocols';

export const makeVerifyAccountController = (): BaseController => {
  // Infra
  const verifyAccountRepository = new AccountPrismaRepository();

  // Data
  const addAccount = new EmailVerifyAccount(
    verifyAccountRepository,
  );

  // Presentation
  return new VerifyAccountController(addAccount);
};
