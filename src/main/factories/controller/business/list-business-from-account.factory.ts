import { DbListBusinessFromAccount } from '@/data/usecases/business';
import { BusinessPrismaRepository } from '@/infra/db/prisma/business';
import { ListBusinessFromAccountController } from '@/presentation/controller/business';
import { ErrorHandlerDecorator } from '@/presentation/decorators';
import { BaseController } from '@/presentation/protocols';

export const makeListBusinessFromAccountController = (): BaseController => {
  const ListBusinessFromAccountRepository = new BusinessPrismaRepository();

  const dbListBusinessFromAccount = new DbListBusinessFromAccount(ListBusinessFromAccountRepository);

  return new ErrorHandlerDecorator(new ListBusinessFromAccountController(dbListBusinessFromAccount));
};
