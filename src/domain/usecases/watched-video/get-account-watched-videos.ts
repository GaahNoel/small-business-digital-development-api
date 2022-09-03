import { WatchedVideoModel } from '@/domain/models';

export namespace GetAccountWatchedVideos {
  export type Params = {
    accountId: string,
  };
  export type Result = {
    videos: WatchedVideoModel[]
  };
}

export interface GetAccountWatchedVideos {
  getAccountVideos(params: GetAccountWatchedVideos.Params): Promise<GetAccountWatchedVideos.Result>
}
