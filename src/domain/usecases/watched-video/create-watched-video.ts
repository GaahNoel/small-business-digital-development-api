export namespace CreateWatchedVideo {
  export type Params = {
    accountId: string,
    url?: string,
  };
  export type Result = {
    watchedVideoId: string
  };
}

export interface CreateWatchedVideo {
  create(params:CreateWatchedVideo.Params): Promise<CreateWatchedVideo.Result>
}
