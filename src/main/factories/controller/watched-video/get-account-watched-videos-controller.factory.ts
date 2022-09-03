import { DBGetAccountById } from '@/data';
import { DbGetAccountWatchedVideos } from '@/data/usecases/watched-video';
import { AccountPrismaRepository } from '@/infra';
import { WatchedVideoPrismaRepository } from '@/infra/db/prisma/watched-video';
import { GetAccountWatchedVideosController } from '@/presentation/controller/watched-video';
import { BaseController } from '@/presentation/protocols';

export const makeGetAccountWatchedController = (): BaseController => {
  const accountRepository = new AccountPrismaRepository();
  const watchedVideoRepository = new WatchedVideoPrismaRepository();

  const getAccountById = new DBGetAccountById(accountRepository);
  const getAccountWatchedVideos = new DbGetAccountWatchedVideos(watchedVideoRepository);

  return new GetAccountWatchedVideosController(getAccountById, getAccountWatchedVideos);
};
