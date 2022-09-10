import { CreateWatchedVideoRepository } from '@/data/protocols/db/watched-video';
import { GetAccountWatchedVideosRepository } from '@/data/protocols/db/watched-video/get-account-watched-videos.repository';
import { prisma } from '@/infra/db/helpers';

export class WatchedVideoPrismaRepository implements CreateWatchedVideoRepository, GetAccountWatchedVideosRepository {
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

  async getAccountVideos(params: GetAccountWatchedVideosRepository.Params) {
    const todayInitialDate = new Date();
    todayInitialDate.setHours(0, 0, 0, 0);
    const tomorrowInitialDate = new Date(todayInitialDate);
    tomorrowInitialDate.setDate(todayInitialDate.getDate() + 1);

    const result = await prisma.accountWatchedVideos.findMany({
      where: {
        accountId: params.accountId,
        createdAt: {
          lte: tomorrowInitialDate,
          gte: todayInitialDate,
        },
      },
    });

    return {
      videos: result,
    };
  }
}
