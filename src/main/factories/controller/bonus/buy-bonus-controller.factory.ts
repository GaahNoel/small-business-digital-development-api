import { DbWithdrawAccountBalance } from '@/data';
import { DbCreateAccountBonus, DbGetBonusById } from '@/data/usecases/bonus';
import { AccountPrismaRepository } from '@/infra';
import { BonusPrismaRepository } from '@/infra/db/prisma/bonus';
import { BuyBonusController } from '@/presentation/controller/bonus';
import { BaseController } from '@/presentation/protocols';

export const makeBuyBonusController = (): BaseController => {
  const bonusRepository = new BonusPrismaRepository();
  const accountRepository = new AccountPrismaRepository();

  const getBonusById = new DbGetBonusById(bonusRepository);
  const createAccountBonus = new DbCreateAccountBonus(bonusRepository, bonusRepository, bonusRepository);
  const withdrawAccountBalance = new DbWithdrawAccountBalance(accountRepository, accountRepository);

  return new BuyBonusController(getBonusById, createAccountBonus, withdrawAccountBalance);
};
