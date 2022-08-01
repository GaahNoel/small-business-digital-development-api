import { DbListBusiness } from '@/data/usecases/business';
import { BusinessPrismaRepository } from '@/infra/db/prisma/business';
import { ListBusinessController } from '@/presentation/controller/business';
import { ErrorHandlerDecorator } from '@/presentation/decorators';
import { BaseController } from '@/presentation/protocols';

export const makeListBusinessController = (): BaseController => {
  const listBusinessRepository = new BusinessPrismaRepository();
  const listBusiness = new DbListBusiness(listBusinessRepository);
  return new ErrorHandlerDecorator(new ListBusinessController(listBusiness));
};
