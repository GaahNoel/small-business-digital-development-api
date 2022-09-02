import { DBGetAccountById } from '@/data';
import { DbCreateWatchedVideo } from '@/data/usecases/watched-video';
import { AccountPrismaRepository } from '@/infra';
import { WatchedVideoPrismaRepository } from '@/infra/db/prisma/watched-video';
import { CreateWatchedVideoController } from '@/presentation/controller/watched-video';
import { BaseController } from '@/presentation/protocols';

export const makeCreateWatchedVideoController = () : BaseController => {
  const watchedVideoRepository = new WatchedVideoPrismaRepository();
  const accountRepository = new AccountPrismaRepository();

  const createWatchedVideo = new DbCreateWatchedVideo(watchedVideoRepository);
  const getAccountById = new DBGetAccountById(accountRepository);

  return new CreateWatchedVideoController(createWatchedVideo, getAccountById);
};
