export namespace GetAccountByIdRepository {
  export type Params = {
    accountId: string;
  };
  export type Result = {
    id: string;
    name: string;
    email: string;
    verified: boolean;
    provider: 'credentials' | 'socialMedia';
    balance: number;
  };
}

export interface GetAccountByIdRepository {
  getById(params: GetAccountByIdRepository.Params): Promise<GetAccountByIdRepository.Result>;
}
