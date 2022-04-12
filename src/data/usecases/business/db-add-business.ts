import { AddBusinessRepository } from '@/data/protocols/db/business/add-business.repository';
import { AddBusiness } from '@/domain/usecases/business/add-business';

export class DbAddBusiness implements AddBusiness {
  constructor(private readonly addBusinessRepository: AddBusinessRepository) { }

  async add(params: AddBusiness.Params): Promise<AddBusiness.Result> {
    const business = await this.addBusinessRepository.add(params);
    return {
      id: business.id,
    };
  }
}
