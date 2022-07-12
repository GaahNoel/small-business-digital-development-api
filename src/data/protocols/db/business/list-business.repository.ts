import { ListBusiness } from '@/domain/usecases/business/list-business';

export namespace ListBusinessRepository {
  export type Params = {
    city?: {
      name: string;
      state: string;
    }
  };
  export type Result = ListBusiness.Result;
}

export interface ListBusinessRepository {
  list(params: ListBusinessRepository.Params): Promise<ListBusinessRepository.Result>;
}
