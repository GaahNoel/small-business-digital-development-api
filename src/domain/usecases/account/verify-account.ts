export namespace VerifyAccount {
  export type Params = string;
  export type Result = {
    verified: boolean;
  };
}

export interface VerifyAccount{
  verify(params: VerifyAccount.Params): Promise<VerifyAccount.Result>;
}
