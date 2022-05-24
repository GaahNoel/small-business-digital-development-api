import { DeleteProductRepository } from '@/data/protocols/db/product/delete-product.repository';
import { DeleteProduct, DeleteProductParams } from '@/domain/usecases/product/delete-product';

namespace DbDeleteProduct {
  export type Params = DeleteProductParams;
  export type Result = {
    id: string,
    delete: boolean
  };
}

export class DbDeleteProduct implements DeleteProduct {
  constructor(private readonly deleteProductRepository: DeleteProductRepository) {}

  async delete(deleteProductParams: DbDeleteProduct.Params): Promise<DbDeleteProduct.Result> {
    const product = await this.deleteProductRepository.delete({
      productId: deleteProductParams.productId,
    });

    return {
      id: product.id,
      delete: true,
    };
  }
}
