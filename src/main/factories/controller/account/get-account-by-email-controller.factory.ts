import { DbGetAccountByEmail } from '@/data';
import { AccountPrismaRepository } from '@/infra';
import { GetAccountByEmailController } from '@/presentation/controller/account';
import { ErrorHandlerDecorator } from '@/presentation/decorators';
import { BaseController } from '@/presentation/protocols';

export const makeGetAccountByEmailController = (): BaseController => {
  const findAccountRepository = new AccountPrismaRepository();

  const getAccountByEmail = new DbGetAccountByEmail(findAccountRepository);

  return new ErrorHandlerDecorator(new GetAccountByEmailController(getAccountByEmail));
};
