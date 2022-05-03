import { AccountModel } from '@/domain/models';

export namespace FindAccountByEmailAndProviderRepository {
  export type Params = {
    email: string;
    provider: string;
  };
  export type Result = AccountModel;
}
export interface FindAccountByEmailAndProviderRepository {
  findByEmailAndProvider(params: FindAccountByEmailAndProviderRepository.Params): Promise<FindAccountByEmailAndProviderRepository.Result>;
}
