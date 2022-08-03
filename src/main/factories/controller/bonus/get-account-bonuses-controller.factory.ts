import { DbGetAccountBonuses, DbHandleBonusStatus } from '@/data/usecases/bonus';
import { BonusPrismaRepository } from '@/infra/db/prisma/bonus';
import { GetAccountBonusesController } from '@/presentation/controller/bonus';
import { ErrorHandlerDecorator, HandleBonusStatusDecorator } from '@/presentation/decorators';
import { BaseController } from '@/presentation/protocols';

export const makeGetAccountBonusesController = (): BaseController => {
  const bonusRepository = new BonusPrismaRepository();

  const getAccountBonuses = new DbGetAccountBonuses(bonusRepository);
  const handleBonusStatus = new DbHandleBonusStatus(bonusRepository, bonusRepository);

  const controller = new GetAccountBonusesController(getAccountBonuses);

  const handleBonusStatusDecorator = new HandleBonusStatusDecorator(controller, handleBonusStatus);
  return new ErrorHandlerDecorator(handleBonusStatusDecorator);
};
