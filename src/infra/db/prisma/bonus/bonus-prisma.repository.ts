import { ListBonusRepository } from '@/data/protocols/db/bonus';
import { CreateBonusRepository } from '@/data/protocols/db/bonus/create-bonus.repository';
import { prisma } from '../../helpers';

export class BonusPrismaRepository implements CreateBonusRepository, ListBonusRepository {
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
}
