import { DeleteBusinessRepository, EditBusinessRepository } from '@/data';
import { AddBusinessRepository } from '@/data/protocols/db/business/add-business.repository';
import { ListBusinessByIdRepository } from '@/data/protocols/db/business/list-business-by-id.repository';
import { BusinessModel } from '@/domain/models/business';
import {
  DeleteBusiness, DeleteBusinessParams, EditBusiness, EditBusinessParams, ListBusinessFromAccount,
} from '@/domain/usecases/business';
import { ListBusinessByIdParams, ListBusinessById } from '@/domain/usecases/business/list-business-by-id';
import { prisma } from '@/infra/db/helpers';

export class BusinessPrismaRepository implements AddBusinessRepository, ListBusinessFromAccount, DeleteBusinessRepository, EditBusinessRepository, ListBusinessByIdRepository {
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

  async delete(data: DeleteBusinessParams): Promise<DeleteBusiness.Result> {
    const business = await prisma.business.delete({
      where: {
        id: data.businessId,
      },
    });

    return {
      delete: true,
      id: business.id,
    };
  }

  async edit(data: EditBusinessParams): Promise<EditBusiness.Result> {
    const business = await prisma.business.update({
      where: {
        id: data.businessId,
      },
      data: {
        name: data.name,
        imageUrl: data.imageUrl,
        description: data.description,
        latitude: data.latitude,
        longitude: data.longitude,
        street: data.street,
        city: data.city,
        state: data.state,
        zip: data.zip,
        country: data.country,
      },
    });

    return {
      id: business.id,
    };
  }

  async listById(data: ListBusinessById.Params): Promise<ListBusinessById.Result> {
    const result = await prisma.business.findFirst({
      where: {
        id: data.businessId,
      },
    });

    return {
      id: result.id,
      name: result.name,
      imageUrl: result.imageUrl,
      description: result.description,
      latitude: result.latitude,
      longitude: result.longitude,
      street: result.street,
      city: result.city,
      state: result.state,
      zip: result.zip,
      country: result.country,
      accountId: result.accountId,
    };
  }
}
