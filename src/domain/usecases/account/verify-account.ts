export namespace VerifyAccount {
  export type Params = {
    id: string;
  };
  export type Result = {
    verified: boolean;
  };
}

export interface VerifyAccount{
  verify(params: VerifyAccount.Params): Promise<VerifyAccount.Result>;
}
