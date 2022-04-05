import { VerifyAccount } from '@/domain/usecases/account/verify-account';

export interface VerifyAccountRepository {
  verify(data:VerifyAccountRepository.Params): Promise<VerifyAccountRepository.Result>;
}

export namespace VerifyAccountRepository {
  export type Params = VerifyAccount.Params;
  export type Result = boolean;
}
