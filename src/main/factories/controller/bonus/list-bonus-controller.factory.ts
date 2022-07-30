import { DbListBonus } from '@/data/usecases/bonus';
import { BonusPrismaRepository } from '@/infra/db/prisma/bonus';
import { ListBonusController } from '@/presentation/controller/bonus';
import { BaseController } from '@/presentation/protocols';

export const makeListBonusController = (): BaseController => {
  const listBonusRepository = new BonusPrismaRepository();

  const listBonus = new DbListBonus(listBonusRepository);

  return new ListBonusController(listBonus);
};
