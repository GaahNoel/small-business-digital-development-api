export type AuthAccountParams = {
  token: string;
};

export namespace AuthAccount {
  export type Params = AuthAccountParams;
  export type Result = {
    id: string
  };
}

export interface AuthAccount {
  auth(authAccountParams: AuthAccount.Params): Promise<AuthAccount.Result>;
}
