import { GetProductById } from '@/domain/usecases/product/get-product-by-id';

export interface GetProductByIdRepository {
  get(data:GetProductByIdRepository.Params): Promise<GetProductByIdRepository.Result>;
}

export namespace GetProductByIdRepository {
  export type Params = GetProductById.Params;
  export type Result = GetProductById.Result;
}
