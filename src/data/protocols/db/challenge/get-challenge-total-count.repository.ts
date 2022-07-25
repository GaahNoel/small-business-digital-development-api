export namespace GetChallengeTotalCountRepository {
  export type Params = {};
  export type Result = {
    total: number;
  };
}

export interface GetChallengeTotalCountRepository {
  getTotalCount(): Promise<GetChallengeTotalCountRepository.Result>;
}
