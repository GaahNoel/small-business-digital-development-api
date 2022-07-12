import { AddProductRepository } from '@/data/protocols';
import { AddProduct } from '@/domain/usecases/product/add-product';

export class DbAddProduct implements AddProduct {
  constructor(private readonly addProductRepository: AddProductRepository) {}

  async add(data: AddProduct.Params): Promise<AddProduct.Result> {
    const product = await this.addProductRepository.add(data);

    return {
      id: product.productId,
    };
  }
}
