type GetAccountByIdParams = {
  accountId: string;
};

export namespace GetAccountById {
  export type Params = GetAccountByIdParams;
  export type Result = {
    name: string;
    email: string;
    verified: boolean;
    provider: 'credentials' | 'socialMedia';
  };
}

export interface GetAccountById {
  getById(params: GetAccountByIdParams): Promise<GetAccountById.Result>;
}
