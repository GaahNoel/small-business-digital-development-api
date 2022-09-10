import { DbAddAccountBalance, DBGetAccountById } from '@/data';
import { DbCreateWatchedVideo } from '@/data/usecases/watched-video';
import { AccountPrismaRepository } from '@/infra';
import { WatchedVideoPrismaRepository } from '@/infra/db/prisma/watched-video';
import { CreateWatchedVideoController } from '@/presentation/controller/watched-video';
import { ErrorHandlerDecorator } from '@/presentation/decorators';
import { BaseController } from '@/presentation/protocols';

export const makeCreateWatchedVideoController = () : BaseController => {
  const watchedVideoRepository = new WatchedVideoPrismaRepository();
  const accountRepository = new AccountPrismaRepository();

  const createWatchedVideo = new DbCreateWatchedVideo(watchedVideoRepository);
  const getAccountById = new DBGetAccountById(accountRepository);
  const addAccountBalance = new DbAddAccountBalance(accountRepository, accountRepository);

  return new ErrorHandlerDecorator(new CreateWatchedVideoController(createWatchedVideo, getAccountById, addAccountBalance));
};
