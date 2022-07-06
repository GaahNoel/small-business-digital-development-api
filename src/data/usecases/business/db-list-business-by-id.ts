import { ListBusinessByIdRepository } from '@/data/protocols/db/business/list-business-by-id.repository';
import { ListBusinessById, ListBusinessByIdParams } from '@/domain/usecases/business/list-business-by-id';
import { NotFound } from '@/presentation/errors/not-found.error';

export class DbListBusinessById implements ListBusinessById {
  constructor(private readonly listBusinessByIdRepository: ListBusinessByIdRepository) {}

  async list(listBusinessParams: ListBusinessByIdParams): Promise<ListBusinessByIdRepository.Result> {
    const result = await this.listBusinessByIdRepository.listById({
      businessId: listBusinessParams.businessId,
    });
    if (!result) {
      throw new NotFound({
        entity: 'Business',
      });
    }

    return {
      id: result.id,
      name: result.name,
      description: result.description,
      accountId: result.accountId,
      imageUrl: result.imageUrl,
      latitude: result.latitude,
      longitude: result.longitude,
      street: result.street,
      city: result.city,
      state: result.state,
      zip: result.zip,
      country: result.country,
    };
  }
}
