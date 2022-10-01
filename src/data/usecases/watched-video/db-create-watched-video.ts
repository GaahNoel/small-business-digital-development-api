import { CreateWatchedVideoRepository } from '@/data/protocols/db/watched-video';
import { CreateWatchedVideo } from '@/domain/usecases/watched-video';

export class DbCreateWatchedVideo implements CreateWatchedVideo {
  constructor(private readonly createWatchedVideoRepository: CreateWatchedVideoRepository) {}

  async create(params: CreateWatchedVideo.Params): Promise<CreateWatchedVideo.Result> {
    const response = await this.createWatchedVideoRepository.create({
      accountId: params.accountId,
      url: params.url,
    });

    return {
      watchedVideoId: response.watchedVideoId,
    };
  }
}
