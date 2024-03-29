import { DbAddBusiness } from '@/data/usecases/business/db-add-business';
import { BusinessPrismaRepository } from '@/infra/db/prisma/business';
import { AddBusinessController } from '@/presentation/controller/business/add-business.controller';
import { ErrorHandlerDecorator } from '@/presentation/decorators';
import { BaseController } from '@/presentation/protocols';

export const makeAddBusinessController = (): BaseController => {
  const addBusinessRepository = new BusinessPrismaRepository();

  const dbAddBusiness = new DbAddBusiness(addBusinessRepository);

  return new ErrorHandlerDecorator(new AddBusinessController(dbAddBusiness));
};
