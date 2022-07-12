import { ListProductFromBusiness } from '@/domain/usecases/product';

export interface ListProductFromBusinessRepository {
  list(data:ListProductFromBusinessRepository.Params): Promise<ListProductFromBusinessRepository.Result>;
}

export namespace ListProductFromBusinessRepository {
  export type Params = ListProductFromBusiness.Params;
  export type Result = {
    id: string;
    name: string;
    type: 'product' | 'service';
    description: string;
    listPrice: number;
    salePrice: number;
    imageUrl: string;
    businessId: string;
    category: {
      id: string;
      name: string;
    }
  }[];
}
