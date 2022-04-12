import { AddBusinessRepository } from '@/data/protocols/db/business/add-business.repository';
import { BusinessModel } from '@/domain/models/business';
import { ListBusinessFromAccount } from '@/domain/usecases/business';
import { prisma } from '@/infra/db/helpers';

export class BusinessPrismaRepository implements AddBusinessRepository, ListBusinessFromAccount {
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

  async list(params: ListBusinessFromAccount.Params): Promise<ListBusinessFromAccount.Result> {
    const { accountId } = params;
    const businesses = await prisma.business.findMany({
      where: {
        accountId,
      },
    });

    const mappedBusiness = businesses.map((business: BusinessModel) => ({
      id: business.id,
      name: business.name,
      description: business.description,
      imageUrl: business.imageUrl,
    }));

    return mappedBusiness;
  }
}
