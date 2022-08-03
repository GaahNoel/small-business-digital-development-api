import { DbListBonus } from '@/data/usecases/bonus';
import { BonusPrismaRepository } from '@/infra/db/prisma/bonus';
import { ListBonusController } from '@/presentation/controller/bonus';
import { ErrorHandlerDecorator } from '@/presentation/decorators';
import { BaseController } from '@/presentation/protocols';

export const makeListBonusController = (): BaseController => {
  const listBonusRepository = new BonusPrismaRepository();

  const listBonus = new DbListBonus(listBonusRepository);

  return new ErrorHandlerDecorator(new ListBonusController(listBonus));
};
