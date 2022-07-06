import { AddProduct } from '@/domain/usecases/product/add-product';

export interface AddProductRepository {
  add(data:AddProductRepository.Params): Promise<AddProductRepository.Result>;
}

export namespace AddProductRepository {
  export type Params = AddProduct.Params;
  export type Result = {
    productId: string
  };
}
