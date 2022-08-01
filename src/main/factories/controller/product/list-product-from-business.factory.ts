import { DbListProductFromBusiness } from '@/data/usecases/product';
import { ProductPrismaRepository } from '@/infra/db/prisma/product';
import { ListProductFromBusinessController } from '@/presentation/controller/product';
import { ErrorHandlerDecorator } from '@/presentation/decorators';
import { BaseController } from '@/presentation/protocols';

export const makeListProductFromBusinessController = (): BaseController => {
  const listProductFromBusinessRepository = new ProductPrismaRepository();

  const dbListProductFromBusiness = new DbListProductFromBusiness(listProductFromBusinessRepository);

  return new ErrorHandlerDecorator(new ListProductFromBusinessController(dbListProductFromBusiness));
};
