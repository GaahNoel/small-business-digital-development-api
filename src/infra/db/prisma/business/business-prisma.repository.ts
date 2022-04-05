import { AddBusinessRepository } from '@/data/protocols/db/business/add-business.repository';
import { prisma } from '@/infra/db/helpers';

export class BusinessPrismaRepository implements AddBusinessRepository {
  async add(data: AddBusinessRepository.Params): Promise<AddBusinessRepository.Result> {
    const {
      accountId, description, imageUrl, name,
    } = data;
    const business = await prisma.business.create({
      data: {
        accountId,
        description,
        imageUrl,
        name,
      },
    });
    return business;
  }
}
