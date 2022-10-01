import { GetAccountWatchedVideosRepository } from '@/data/protocols/db/watched-video/get-account-watched-videos.repository';
import { GetAccountWatchedVideos } from '@/domain/usecases/watched-video/get-account-watched-videos';

export class DbGetAccountWatchedVideos implements GetAccountWatchedVideos {
  constructor(private readonly getAccountWatchedVideosRepository: GetAccountWatchedVideosRepository) {}

  async getAccountVideos(params: GetAccountWatchedVideos.Params): Promise<GetAccountWatchedVideos.Result> {
    const response = await this.getAccountWatchedVideosRepository.getAccountVideos({
      accountId: params.accountId,
    });

    return response;
  }
}
