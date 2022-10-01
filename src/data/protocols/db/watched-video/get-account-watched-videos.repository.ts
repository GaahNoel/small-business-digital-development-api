import { WatchedVideoModel } from '@/domain/models';

export namespace GetAccountWatchedVideosRepository {
  export type Params = {
    accountId: string
  };
  export type Result = {
    videos: Array<WatchedVideoModel>
  };

}

export interface GetAccountWatchedVideosRepository {
  getAccountVideos(params: GetAccountWatchedVideosRepository.Params)
}
