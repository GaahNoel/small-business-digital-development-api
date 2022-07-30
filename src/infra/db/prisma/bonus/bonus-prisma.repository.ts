import { CreateAccountBonusRepository, ListBonusRepository } from '@/data/protocols/db/bonus';
import { CreateBonusRepository } from '@/data/protocols/db/bonus/create-bonus.repository';
import { GetAccountBonusRepository } from '@/data/protocols/db/bonus/get-account-bonus.repository';
import { GetBonusByIdRepository } from '@/data/protocols/db/bonus/get-bonus-by-id.repository';
import { Bonus } from '@/domain/models/bonus';
import { prisma } from '../../helpers';

export class BonusPrismaRepository implements
 CreateBonusRepository,
  ListBonusRepository,
  CreateAccountBonusRepository,
  GetBonusByIdRepository,
  GetAccountBonusRepository {
  async create(params: CreateBonusRepository.Params): Promise<CreateBonusRepository.Result> {
    const createdBonus = await prisma.bonus.create({
      data: {
        ...params,
      },
    });

    return {
      bonusId: createdBonus.id,
    };
  }

  async list(params: ListBonusRepository.Params): Promise<ListBonusRepository.Result> {
    const where = params.type ? { type: params.type } : undefined;
    const bonuses = await prisma.bonus.findMany({
      where,
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        duration: true,
        type: true,
        percent: true,
      },
    });
    return bonuses;
  }

  async createAccountBonus(params: CreateAccountBonusRepository.Params): Promise<CreateAccountBonusRepository.Result> {
    const createdAccountBonus = await prisma.accountBonus.create({
      data: {
        ...params,
      },
    });

    return {
      accountBonusId: createdAccountBonus.id,
    };
  }

  async getAccountBonus(params: GetAccountBonusRepository.Params): Promise<GetAccountBonusRepository.Result> {
    const accountBonuses = await prisma.accountBonus.findMany({
      where: {
        accountId: params.accountId,
        bonus: {
          type: params.type,
        },
      },
      select: {
        id: true,
        accountId: true,
        bonus: {
          select: {
            id: true,
            type: true,
            duration: true,
            price: true,
            name: true,
            description: true,
            percent: true,
          },
        },
        quantity: true,
        measure: true,
        value: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return accountBonuses;
  }

  async getBonusById(params: GetBonusByIdRepository.Params): Promise<GetBonusByIdRepository.Result> {
    const bonus = await prisma.bonus.findFirst({
      where: {
        id: params.bonusId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        duration: true,
        type: true,
        percent: true,
      },
    });

    return bonus;
  }
}
