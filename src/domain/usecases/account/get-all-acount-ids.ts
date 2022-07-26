export type GetAllAccountIdsParams = {};

export namespace GetAllAccountIds {
  export type Params = GetAllAccountIdsParams;
  export type Result = {
    accountIds: string[];
  };
}

export interface GetAllAccountIds {
  getAllAccountIds(): Promise<GetAllAccountIds.Result>;
}
