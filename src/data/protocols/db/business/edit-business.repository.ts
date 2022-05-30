import { EditBusiness } from '@/domain/usecases/business';

export interface EditBusinessRepository {
  edit(data:EditBusinessRepository.Params): Promise<EditBusinessRepository.Result>;
}

export namespace EditBusinessRepository {
  export type Params = EditBusiness.Params;
  export type Result = EditBusiness.Result;
}
