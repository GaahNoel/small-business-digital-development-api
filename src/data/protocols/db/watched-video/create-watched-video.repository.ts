export namespace CreateWatchedVideoRepository {
  export type Params = {
    url: string,
    accountId: string,
  };
  export type Result = {
    watchedVideoId: string,
  };
}

export interface CreateWatchedVideoRepository {
  create(createWatchedVideoRepository: CreateWatchedVideoRepository.Params): Promise<CreateWatchedVideoRepository.Result>
}
