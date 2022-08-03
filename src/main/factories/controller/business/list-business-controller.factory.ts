import { DbHandleBonusStatus } from '@/data/usecases/bonus';
import { DbListBusiness } from '@/data/usecases/business';
import { BonusPrismaRepository } from '@/infra/db/prisma/bonus';
import { BusinessPrismaRepository } from '@/infra/db/prisma/business';
import { ListBusinessController } from '@/presentation/controller/business';
import { ErrorHandlerDecorator, HandleBonusStatusDecorator } from '@/presentation/decorators';
import { BaseController } from '@/presentation/protocols';

export const makeListBusinessController = (): BaseController => {
  const listBusinessRepository = new BusinessPrismaRepository();
  const bonusRepository = new BonusPrismaRepository();

  const listBusiness = new DbListBusiness(listBusinessRepository);
  const handleBonusStatus = new DbHandleBonusStatus(bonusRepository, bonusRepository);

  const controller = new ListBusinessController(listBusiness);

  const handleBonusStatusDecorator = new HandleBonusStatusDecorator(controller, handleBonusStatus);
  return new ErrorHandlerDecorator(handleBonusStatusDecorator);
};
