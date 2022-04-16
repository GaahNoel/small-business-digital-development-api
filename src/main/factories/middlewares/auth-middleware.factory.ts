import { DbAuthAccount } from '@/data/usecases/account/db-auth-account';
import { AccountPrismaRepository } from '@/infra';
import { JwtAdapter } from '@/infra/cryptography';
import { env } from '@/main/config/env';
import { AuthMiddleware } from '@/presentation/middlewares';
import { Middleware } from '@/presentation/protocols';

export const makeAuthMiddleware = (): Middleware => {
  const findAccountByEmailRepository = new AccountPrismaRepository();
  const decryper = new JwtAdapter(env.jwtSecret);

  // Data
  const dbAuthAccount = new DbAuthAccount(findAccountByEmailRepository, decryper);

  // Presentation
  return new AuthMiddleware(dbAuthAccount);
};
