import { DbEditBusiness } from '@/data/usecases/business';
import { BusinessPrismaRepository } from '@/infra/db/prisma/business';
import { EditBusinessController } from '@/presentation/controller/business';
import { ErrorHandlerDecorator } from '@/presentation/decorators';
import { BaseController } from '@/presentation/protocols';

export const makeEditBusinessController = (): BaseController => {
  const editBusinessRepository = new BusinessPrismaRepository();

  const dbEditBusiness = new DbEditBusiness(editBusinessRepository);

  return new ErrorHandlerDecorator(new EditBusinessController(dbEditBusiness));
};
