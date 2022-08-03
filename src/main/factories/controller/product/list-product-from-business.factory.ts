import { DbHandleBonusStatus } from '@/data/usecases/bonus';
import { DbListProductFromBusiness } from '@/data/usecases/product';
import { BonusPrismaRepository } from '@/infra/db/prisma/bonus';
import { ProductPrismaRepository } from '@/infra/db/prisma/product';
import { ListProductFromBusinessController } from '@/presentation/controller/product';
import { ErrorHandlerDecorator, HandleBonusStatusDecorator } from '@/presentation/decorators';
import { BaseController } from '@/presentation/protocols';

export const makeListProductFromBusinessController = (): BaseController => {
  const listProductFromBusinessRepository = new ProductPrismaRepository();
  const bonusRepository = new BonusPrismaRepository();

  const dbListProductFromBusiness = new DbListProductFromBusiness(listProductFromBusinessRepository);
  const handleBonusStatus = new DbHandleBonusStatus(bonusRepository, bonusRepository);

  const controller = new ListProductFromBusinessController(dbListProductFromBusiness);
  const handleBonusStatusDecorator = new HandleBonusStatusDecorator(controller, handleBonusStatus);
  return new ErrorHandlerDecorator(handleBonusStatusDecorator);
};
