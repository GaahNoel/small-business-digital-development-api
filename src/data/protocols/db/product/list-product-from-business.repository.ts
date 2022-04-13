import { ListProductFromBusiness } from '@/domain/usecases/product';

export interface ListProductFromBusinessRepository {
  list(data:ListProductFromBusinessRepository.Params): Promise<ListProductFromBusinessRepository.Result>;
}

export namespace ListProductFromBusinessRepository {
  export type Params = ListProductFromBusiness.Params;
  export type Result = ListProductFromBusiness.Result;
}
