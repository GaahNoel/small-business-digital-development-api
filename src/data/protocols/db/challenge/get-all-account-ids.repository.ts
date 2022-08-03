import { GetAllAccountIds } from '@/domain/usecases/account/get-all-acount-ids';

export namespace GetAllAccountIdsRepository {
  export type Params = GetAllAccountIds;
  export type Result = {
    accountIds: string[];
  };
}

export interface GetAllAccountIdsRepository {
  getAllAccountIds(): Promise<GetAllAccountIdsRepository.Result>;
}
