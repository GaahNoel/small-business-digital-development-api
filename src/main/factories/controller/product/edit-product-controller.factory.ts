import { DbEditProduct } from '@/data/usecases/product';
import { ProductPrismaRepository } from '@/infra/db/prisma/product';
import { EditProductController } from '@/presentation/controller/product';
import { BaseController } from '@/presentation/protocols';

export const makeEditProductController = (): BaseController => {
  const editProductRepository = new ProductPrismaRepository();

  const dbEditProduct = new DbEditProduct(editProductRepository);

  return new EditProductController(dbEditProduct);
};
