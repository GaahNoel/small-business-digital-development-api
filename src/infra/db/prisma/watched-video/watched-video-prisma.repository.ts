import { CreateWatchedVideoRepository } from '@/data/protocols/db/watched-video';
import { prisma } from '@/infra/db/helpers';

export class WatchedVideoPrismaRepository implements CreateWatchedVideoRepository {
  async create(params: CreateWatchedVideoRepository.Params): Promise<CreateWatchedVideoRepository.Result> {
    const result = await prisma.accountWatchedVideos.create({
      data: {
        accountId: params.accountId,
        url: params.url,
      },
    });

    return {
      watchedVideoId: result.id,
    };
  }
}
