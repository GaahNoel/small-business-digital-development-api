import { ListProductsByBusinesses } from '@/domain/usecases/product';

export namespace ListProductsByBusinessesRepository {
  export type Params = ListProductsByBusinesses.Params;
  export type Result = {
    id: string;
    name: string;
    type: 'product' | 'service';
    description: string;
    listPrice: number;
    salePrice: number;
    imageUrl: string;
    business: {
      id: string;
      name: string;
      latitude: string;
      longitude: string;
    };
    category: {
      id: string;
      name: string;
    };
    createdAt?: Date;
  }[];
}

export interface ListProductsByBusinessesRepository {
  listProductByBusinesses(params: ListProductsByBusinessesRepository.Params): Promise<ListProductsByBusinessesRepository.Result>;
}
