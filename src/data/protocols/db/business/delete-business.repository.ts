import { DeleteBusiness } from '@/domain/usecases/business';

export interface DeleteBusinessRepository {
  delete(data:DeleteBusinessRepository.Params): Promise<DeleteBusinessRepository.Result>;
}

export namespace DeleteBusinessRepository {
  export type Params = DeleteBusiness.Params;
  export type Result = DeleteBusiness.Result;
}
