import { DbCheckAccountPassword } from '@/data/usecases/account/db-check-account-password';
import { AccountPrismaRepository } from '@/infra';
import { BcryptAdapter } from '@/infra/cryptography';
import { CheckAccountPasswordController } from '@/presentation/controller/account/check-account-password.controller';
import { BaseController } from '@/presentation/protocols';

export const makeCheckAccountPasswordController = (): BaseController => {
  const salt = 12;
  const getUserByEmailRepository = new AccountPrismaRepository();
  const hashComparer = new BcryptAdapter(salt);

  const checkAccountPassword = new DbCheckAccountPassword(getUserByEmailRepository, hashComparer);

  return new CheckAccountPasswordController(checkAccountPassword);
};
