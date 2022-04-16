import { AddBusinessRepository } from '@/data/protocols/db/business/add-business.repository';
import { BusinessModel } from '@/domain/models/business';
import { ListBusinessFromAccount } from '@/domain/usecases/business';
import { prisma } from '@/infra/db/helpers';

export class BusinessPrismaRepository implements AddBusinessRepository, ListBusinessFromAccount {
  async add(data: AddBusinessRepository.Params): Promise<AddBusinessRepository.Result> {
    const business = await prisma.business.create({
      data,
    });
    return business;
  }

  async list(params: ListBusinessFromAccount.Params): Promise<ListBusinessFromAccount.Result> {
    const { accountId: receivedAccountId } = params;
    const businesses = await prisma.business.findMany({
      where: {
        accountId: receivedAccountId,
      },
    });

    const mappedBusiness = businesses.map((business: BusinessModel) => {
      const { accountId, productIds, ...rest } = business;

      return rest;
    });

    return mappedBusiness;
  }
}
