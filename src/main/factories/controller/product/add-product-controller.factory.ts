import { DbAddProduct } from '@/data/usecases/product';
import { ProductPrismaRepository } from '@/infra/db/prisma/product';
import { AddProductController } from '@/presentation/controller/product/add-product.controller';
import { ErrorHandlerDecorator } from '@/presentation/decorators';
import { BaseController } from '@/presentation/protocols';

export const makeAddProductController = (): BaseController => {
  const addProductRepository = new ProductPrismaRepository();

  const dbAddProduct = new DbAddProduct(addProductRepository);

  return new ErrorHandlerDecorator(new AddProductController(dbAddProduct));
};
