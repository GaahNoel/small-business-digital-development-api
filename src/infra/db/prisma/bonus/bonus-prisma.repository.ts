import {
  ChangeBonusStatusRepository, CreateAccountBonusRepository, GetAccountBonusByIdRepository, ListBonusRepository,
} from '@/data/protocols/db/bonus';
import { CreateBonusRepository } from '@/data/protocols/db/bonus/create-bonus.repository';
import { GetAccountBonusRepository } from '@/data/protocols/db/bonus/get-account-bonus.repository';
import { GetBonusByIdRepository } from '@/data/protocols/db/bonus/get-bonus-by-id.repository';
import { ListAccountBonusRepository } from '@/data/protocols/db/bonus/list-account-bonuses.repository';
import { prisma } from '../../helpers';

export class BonusPrismaRepository implements
  CreateBonusRepository,
  ListBonusRepository,
  CreateAccountBonusRepository,
  GetBonusByIdRepository,
  GetAccountBonusRepository,
  GetAccountBonusByIdRepository,
  ChangeBonusStatusRepository,
  ListAccountBonusRepository {
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
      orderBy: {
        price: 'asc',
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
    const where = {
      accountId: params.accountId,
      bonus: {
        type: params.type,
      },
    };

    if (params.status) {
      Object.assign(where, { status: params.status });
    }

    const accountBonuses = await prisma.accountBonus.findMany({
      where,
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

  async getAccountBonusById(params: GetAccountBonusByIdRepository.Params): Promise<GetAccountBonusByIdRepository.Result> {
    const accountBonus = await prisma.accountBonus.findFirst({
      where: {
        id: params.bonusId,
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

    return accountBonus;
  }

  async changeBonusStatus(params: ChangeBonusStatusRepository.Params): Promise<ChangeBonusStatusRepository.Result> {
    const updatedBonus = await prisma.accountBonus.update({
      where: {
        id: params.accountBonusId,
      },
      data: {
        status: params.status,
      },
    });

    return {
      status: updatedBonus.status,
    };
  }

  async listAccountBonuses(params: ListAccountBonusRepository.Params): Promise<ListAccountBonusRepository.Result> {
    const where = params.accountId ? {
      accountId: params.accountId,
    } : {};

    const accountBonuses = await prisma.accountBonus.findMany({
      where,
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
}
