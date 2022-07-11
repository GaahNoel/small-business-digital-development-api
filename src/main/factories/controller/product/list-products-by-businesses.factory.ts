import { DbListBusiness } from '@/data/usecases/business';
import { DbListProductsByBusinesses } from '@/data/usecases/product';
import { BusinessPrismaRepository } from '@/infra/db/prisma/business';
import { ProductPrismaRepository } from '@/infra/db/prisma/product';
import { ListProductsByBusinessesController } from '@/presentation/controller/product';
import { BaseController } from '@/presentation/protocols';

export const makeListProductsByBusinessesController = (): BaseController => {
  const listBusinessRepository = new BusinessPrismaRepository();
  const listProductsByBusinessesRepository = new ProductPrismaRepository();

  const listBusiness = new DbListBusiness(listBusinessRepository);
  const listProductsByBusinesses = new DbListProductsByBusinesses(listProductsByBusinessesRepository);

  return new ListProductsByBusinessesController(listBusiness, listProductsByBusinesses);
};
