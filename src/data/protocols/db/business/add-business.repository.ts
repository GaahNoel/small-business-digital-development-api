import { AddBusiness } from '@/domain/usecases/business';

export interface AddBusinessRepository {
  add(data:AddBusinessRepository.Params): Promise<AddBusinessRepository.Result>;
}

export namespace AddBusinessRepository {
  export type Params = AddBusiness.Params;
  export type Result = AddBusiness.Result;
}
