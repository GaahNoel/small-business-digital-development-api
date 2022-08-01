import { EmailVerifyAccount } from '@/data/usecases/account/email-verify-account';
import { AccountPrismaRepository } from '@/infra';
import { JwtAdapter } from '@/infra/cryptography';
import { WinstonLogger } from '@/main/adapters/winston/logger.adapter';
import { env } from '@/main/config/env';
import { VerifyAccountController } from '@/presentation/controller/account/verify-account.controller';
import { ErrorHandlerDecorator } from '@/presentation/decorators';
import { BaseController } from '@/presentation/protocols';

export const makeVerifyAccountController = (): BaseController => {
  const verifyAccountRepository = new AccountPrismaRepository();
  const encrypter = new JwtAdapter(env.jwtSecret);

  const logger = new WinstonLogger();

  const addAccount = new EmailVerifyAccount(
    verifyAccountRepository,
    encrypter,
  );

  return new ErrorHandlerDecorator(new VerifyAccountController(addAccount));
};
