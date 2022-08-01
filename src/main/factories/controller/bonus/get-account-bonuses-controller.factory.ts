import { DbGetAccountBonuses } from '@/data/usecases/bonus';
import { BonusPrismaRepository } from '@/infra/db/prisma/bonus';
import { GetAccountBonusesController } from '@/presentation/controller/bonus';
import { BaseController } from '@/presentation/protocols';

export const makeGetAccountBonusesController = (): BaseController => {
  const bonusRepository = new BonusPrismaRepository();

  const getAccountBonuses = new DbGetAccountBonuses(bonusRepository);

  return new GetAccountBonusesController(getAccountBonuses);
};
