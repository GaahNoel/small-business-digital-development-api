export type GetAccountByEmailParams = {
  email: string;
};

export namespace GetAccountByEmail {
  export type Params = GetAccountByEmailParams;
  export type Result = {
    email: string,
    name: string,
    id: string,
    verified: boolean,
    provider: 'credentials' | 'facebook' | 'google',
  };
}

export interface GetAccountByEmail {
  get(GetAccountByEmailAccountParams: GetAccountByEmail.Params): Promise<GetAccountByEmail.Result>;
}
