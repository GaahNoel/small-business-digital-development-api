import { DbEditProduct } from '@/data/usecases/product';
import { ProductPrismaRepository } from '@/infra/db/prisma/product';
import { EditProductController } from '@/presentation/controller/product';
import { ErrorHandlerDecorator } from '@/presentation/decorators';
import { BaseController } from '@/presentation/protocols';

export const makeEditProductController = (): BaseController => {
  const editProductRepository = new ProductPrismaRepository();

  const dbEditProduct = new DbEditProduct(editProductRepository);

  return new ErrorHandlerDecorator(new EditProductController(dbEditProduct));
};
