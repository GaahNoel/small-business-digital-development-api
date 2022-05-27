import { EditProductRepository } from '@/data/protocols/db/product/edit-product.repository';
import { EditProduct } from '@/domain/usecases/product/edit-product';

export class DbEditProduct implements EditProduct {
  constructor(private readonly editProductRepository: EditProductRepository) {}

  async edit(editProductParams: EditProduct.Params): Promise<EditProduct.Result> {
    const product = await this.editProductRepository.edit(editProductParams);

    return {
      productId: product.productId,
    };
  }
}
