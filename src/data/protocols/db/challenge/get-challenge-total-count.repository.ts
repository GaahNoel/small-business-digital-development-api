export namespace GetChallengeTotalCountRepository {
  export type Params = {
    periodicity?: 'daily' | 'weekly'
  };
  export type Result = {
    total: number;
  };
}

export interface GetChallengeTotalCountRepository {
  getTotalCount(params: GetChallengeTotalCountRepository.Params): Promise<GetChallengeTotalCountRepository.Result>;
}
