import { DbListBusinessById } from '@/data/usecases/business/db-list-business-by-id';
import { BusinessPrismaRepository } from '@/infra/db/prisma/business';
import { ListBusinessByIdController } from '@/presentation/controller/business/list-business-by-id.controller';
import { BaseController } from '@/presentation/protocols';

export const makeListBusinessByIdController = (): BaseController => {
  const ListBusinessFromAccountRepository = new BusinessPrismaRepository();

  const dbListBusinessFromAccount = new DbListBusinessById(ListBusinessFromAccountRepository);

  return new ListBusinessByIdController(dbListBusinessFromAccount);
};
