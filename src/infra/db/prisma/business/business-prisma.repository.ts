import { truncateSync } from 'fs';
import {
  DeleteBusinessRepository, EditBusinessRepository, ListBusinessFromAccountRepository, ListBusinessRepository,
} from '@/data';
import { AddBusinessRepository } from '@/data/protocols/db/business/add-business.repository';
import { GetBusinessCitiesAndStatesRepository } from '@/data/protocols/db/business/get-business-cities-and-states.repository';
import { ListBusinessByIdRepository } from '@/data/protocols/db/business/list-business-by-id.repository';
import { BusinessModel } from '@/domain/models/business';
import {
  DeleteBusiness, DeleteBusinessParams, EditBusiness, EditBusinessParams, ListBusiness, ListBusinessFromAccount,
} from '@/domain/usecases/business';
import { prisma } from '@/infra/db/helpers';

export class BusinessPrismaRepository implements
  AddBusinessRepository,
  ListBusinessFromAccountRepository,
  DeleteBusinessRepository,
  EditBusinessRepository,
  ListBusinessByIdRepository,
  ListBusinessRepository,
  GetBusinessCitiesAndStatesRepository {
  async add(data: AddBusinessRepository.Params): Promise<AddBusinessRepository.Result> {
    const business = await prisma.business.create({
      data,
    });
    return business;
  }

  async listFromAccount(params: ListBusinessFromAccount.Params): Promise<ListBusinessFromAccount.Result> {
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
        maxPermittedCouponPercentage: data.maxPermittedCouponPercentage,
      },
    });

    return {
      id: business.id,
    };
  }

  async listById(data: ListBusinessByIdRepository.Params): Promise<ListBusinessByIdRepository.Result> {
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
      maxPermittedCouponPercentage: result.maxPermittedCouponPercentage,
    };
  }

  async list(params: ListBusinessRepository.Params): Promise<ListBusiness.Result> {
    const { city } = params;

    const where = {} as { city?: { equals: string, mode: 'insensitive' }, state?: { equals: string, mode: 'insensitive' } };

    if (city) {
      where.city = {
        equals: city.name,
        mode: 'insensitive',
      };
      where.state = {
        equals: city.state,
        mode: 'insensitive',
      };
    }

    const businessesWithHighlight = await prisma.business.findMany({
      where: {
        ...where,
        AccountBonus: {
          some: {
            status: 'ACTIVE',
          },
        },
      },
      select: {
        id: true,
        name: true,
        imageUrl: true,
        description: true,
        latitude: true,
        longitude: true,
        street: true,
        city: true,
        state: true,
        zip: true,
        country: true,
        accountId: true,
        maxPermittedCouponPercentage: true,
        AccountBonus: {
          select: {
            id: true,
            status: true,
            value: true,
            measure: true,
          },
          orderBy: {
            value: 'asc',
          },
        },
      },
    });

    const businessesWithoutHighlight = await prisma.business.findMany({
      where: {
        ...where,
        AccountBonus: undefined,
        NOT: {
          id: {
            in: businessesWithHighlight.map((business) => business.id),
          },
        },
      },
      select: {
        id: true,
        name: true,
        imageUrl: true,
        description: true,
        latitude: true,
        longitude: true,
        street: true,
        city: true,
        state: true,
        zip: true,
        country: true,
        accountId: true,
        maxPermittedCouponPercentage: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return [...businessesWithHighlight.map((business) => ({
      ...business,
      highlighted: true,
    })), ...businessesWithoutHighlight.map((business) => ({
      ...business,
      highlighted: false,
    }))];
  }

  async getCitiesAndStates(): Promise<GetBusinessCitiesAndStatesRepository.Result> {
    const result = await prisma.business.groupBy({
      by: ['city', 'state'],
      orderBy: [{ state: 'asc' }, { city: 'asc' }],
    });

    return result.map((item) => ({
      state: item.state,
      city: item.city,
    }));
  }
}
