import { EditProduct } from '@/domain/usecases/product';

export interface EditProductRepository {
  edit(data:EditProductRepository.Params): Promise<EditProductRepository.Result>;
}

export namespace EditProductRepository {
  export type Params = EditProduct.Params;
  export type Result = {
    productId: string
  };
}
