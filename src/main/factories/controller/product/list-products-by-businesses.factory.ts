import { DbHandleBonusStatus } from '@/data/usecases/bonus';
import { DbListBusiness } from '@/data/usecases/business';
import { DbListProductsByBusinesses } from '@/data/usecases/product';
import { BonusPrismaRepository } from '@/infra/db/prisma/bonus';
import { BusinessPrismaRepository } from '@/infra/db/prisma/business';
import { ProductPrismaRepository } from '@/infra/db/prisma/product';
import { ListProductsByBusinessesController } from '@/presentation/controller/product';
import { ErrorHandlerDecorator, HandleBonusStatusDecorator } from '@/presentation/decorators';
import { BaseController } from '@/presentation/protocols';

export const makeListProductsByBusinessesController = (): BaseController => {
  const listBusinessRepository = new BusinessPrismaRepository();
  const listProductsByBusinessesRepository = new ProductPrismaRepository();
  const bonusRepository = new BonusPrismaRepository();

  const listBusiness = new DbListBusiness(listBusinessRepository);
  const listProductsByBusinesses = new DbListProductsByBusinesses(listProductsByBusinessesRepository);
  const handleBonusStatus = new DbHandleBonusStatus(bonusRepository, bonusRepository);

  const controller = new ListProductsByBusinessesController(listBusiness, listProductsByBusinesses);

  const handleBonusStatusDecorator = new HandleBonusStatusDecorator(controller, handleBonusStatus);

  return new ErrorHandlerDecorator(handleBonusStatusDecorator);
};
