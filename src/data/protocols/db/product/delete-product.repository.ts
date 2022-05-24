import { DeleteProduct } from '@/domain/usecases/product';

export interface DeleteProductRepository {
  delete(data:DeleteProductRepository.Params): Promise<DeleteProductRepository.Result>;
}

export namespace DeleteProductRepository {
  export type Params = DeleteProduct.Params;
  export type Result = {
    id: string
  };
}
