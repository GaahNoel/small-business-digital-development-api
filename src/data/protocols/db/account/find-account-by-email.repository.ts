import { AccountModel } from '@/domain/models';

export namespace FindAccountByEmailRepository {
  export type Params = {
    email: string;
  };
  export type Result = AccountModel;
}
export interface FindAccountByEmailRepository {
  findByEmail(params: FindAccountByEmailRepository.Params): Promise<FindAccountByEmailRepository.Result>;
}
