import { VerifyAccount } from '@/domain/usecases/account/verify-account';

export interface EmailVerification {
  verify(data: VerifyAccount.Params): Promise<VerifyAccount.Result>;
}

export namespace EmailVerification {
  export type Params = VerifyAccount.Params;
  export type Result = VerifyAccount.Result;
}
