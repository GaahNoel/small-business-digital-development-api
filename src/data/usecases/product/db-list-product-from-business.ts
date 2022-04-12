import { ListProductFromBusinessRepository } from '@/data/protocols/db/product/list-product-from-business.repository';
import { ListProductFromBusiness } from '@/domain/usecases/product';

export class DbListProductFromBusiness implements ListProductFromBusiness {
  constructor(private readonly listProductFromBusinessRepository: ListProductFromBusinessRepository) {}

  async list(params: ListProductFromBusiness.Params): Promise<ListProductFromBusiness.Result> {
    const { businessId } = params;
    const response = await this.listProductFromBusinessRepository.list({
      businessId,
    });

    return response;
  }
}
