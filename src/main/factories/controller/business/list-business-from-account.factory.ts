import { DbListBusinessFromAccount } from '@/data/usecases/business';
import { BusinessPrismaRepository } from '@/infra/db/prisma/business';
import { ListBusinessFromAccountController } from '@/presentation/controller/business';
import { BaseController } from '@/presentation/protocols';

export const makeListBusinessFromAccountController = (): BaseController => {
  const ListBusinessFromAccountRepository = new BusinessPrismaRepository();

  const dbListBusinessFromAccount = new DbListBusinessFromAccount(ListBusinessFromAccountRepository);

  return new ListBusinessFromAccountController(dbListBusinessFromAccount);
};
