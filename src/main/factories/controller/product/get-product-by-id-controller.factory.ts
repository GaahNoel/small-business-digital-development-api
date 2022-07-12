import { DbGetProductById } from '@/data/usecases/product';
import { ProductPrismaRepository } from '@/infra/db/prisma/product';
import { GetProductByIdController } from '@/presentation/controller/product';
import { BaseController } from '@/presentation/protocols';

export const makeGetProductByIdController = (): BaseController => {
  const getProductByIdRepository = new ProductPrismaRepository();

  const getProductById = new DbGetProductById(getProductByIdRepository);

  return new GetProductByIdController(getProductById);
};
