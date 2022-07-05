import { ListBusinessById } from '@/domain/usecases/business/list-business-by-id';

export interface ListBusinessByIdRepository {
  listById(data:ListBusinessByIdRepository.Params): Promise<ListBusinessByIdRepository.Result>;
}

export namespace ListBusinessByIdRepository {
  export type Params = ListBusinessById.Params;
  export type Result = ListBusinessById.Result;
}
