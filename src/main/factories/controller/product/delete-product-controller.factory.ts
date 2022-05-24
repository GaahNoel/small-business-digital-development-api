import { DbDeleteProduct } from '@/data/usecases/product/db-delete-product';
import { ProductPrismaRepository } from '@/infra/db/prisma/product';
import { DeleteProductController } from '@/presentation/controller/product';
import { BaseController } from '@/presentation/protocols';

export const makeDeleteProductController = (): BaseController => {
  const deleteProductRepository = new ProductPrismaRepository();

  const dbDeleteProduct = new DbDeleteProduct(deleteProductRepository);

  return new DeleteProductController(dbDeleteProduct);
};
