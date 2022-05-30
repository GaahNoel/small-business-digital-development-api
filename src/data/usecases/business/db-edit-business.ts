import { EditBusinessRepository } from '@/data/protocols/db/business/edit-business.repository';
import { EditBusiness } from '@/domain/usecases/business';

export class DbEditBusiness implements EditBusiness {
  constructor(private readonly editBusinessRepository: EditBusinessRepository) {}

  async edit(editBusinessParams: EditBusiness.Params): Promise<EditBusiness.Result> {
    const result = await this.editBusinessRepository.edit(editBusinessParams);
    return {
      id: result.id,
    };
  }
}
