import { DbDeleteBusiness } from '@/data/usecases/business';
import { BusinessPrismaRepository } from '@/infra/db/prisma/business';
import { DeleteBusinessController } from '@/presentation/controller/business';
import { ErrorHandlerDecorator } from '@/presentation/decorators';
import { BaseController } from '@/presentation/protocols';

export const makeDeleteBusinessController = (): BaseController => {
  const deleteBusinessRepository = new BusinessPrismaRepository();

  const dbDeleteBusiness = new DbDeleteBusiness(deleteBusinessRepository);

  return new ErrorHandlerDecorator(new DeleteBusinessController(dbDeleteBusiness));
};
