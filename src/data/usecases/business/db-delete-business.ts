import { DeleteBusinessRepository } from '@/data/protocols/db/business/delete-business.repository';
import { DeleteBusiness } from '@/domain/usecases/business/delete-business';

export class DbDeleteBusiness implements DeleteBusiness {
  constructor(private readonly deleteBusinessRepository: DeleteBusinessRepository) {}

  async delete(params: DeleteBusiness.Params): Promise<DeleteBusiness.Result> {
    const result = await this.deleteBusinessRepository.delete(params);

    return {
      delete: true,
      id: result.id,
    };
  }
}
