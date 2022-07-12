import { GetProductByIdRepository } from '@/data/protocols/db/product/get-product-by-id.repository';
import { GetProductById } from '@/domain/usecases/product/get-product-by-id';
import { NotFound } from '@/presentation/errors/not-found.error';

export class DbGetProductById implements GetProductById {
  constructor(private readonly getProductByIdRepository: GetProductByIdRepository) {}

  async get(data: GetProductById.Params): Promise<GetProductById.Result> {
    const result = await this.getProductByIdRepository.get(data);

    if (!result) {
      throw new NotFound({
        entity: 'Product',
      });
    }

    return {
      name: result.name,
      type: result.type,
      description: result.description,
      listPrice: result.listPrice,
      salePrice: result.salePrice,
      imageUrl: result.imageUrl,
      businessId: result.businessId,
      category: result.category,
    };
  }
}
