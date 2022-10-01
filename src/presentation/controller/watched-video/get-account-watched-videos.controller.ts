import { WatchedVideoModel } from '@/domain/models';
import { GetAccountById } from '@/domain/usecases/account';
import { GetAccountWatchedVideos } from '@/domain/usecases/watched-video';
import { MissingParamsError } from '@/presentation/errors';
import { success } from '@/presentation/helpers/http.helpers';
import { BaseController, HttpResponse } from '@/presentation/protocols';

namespace GetAccountWatchedVideosController {
  export type Params = {
    accountId: string,
  };
  export type Result = HttpResponse<{ videos: WatchedVideoModel[] }>;
}

export class GetAccountWatchedVideosController implements BaseController {
  constructor(
    private readonly getAccountById: GetAccountById,
    private readonly getAccountWatchedVideos: GetAccountWatchedVideos,
  ) {}

  async handle(data: GetAccountWatchedVideosController.Params): Promise<GetAccountWatchedVideosController.Result> {
    this.validate(data);

    await this.getAccountById.getById({
      accountId: data.accountId,
    });

    const response = await this.getAccountWatchedVideos.getAccountVideos({
      accountId: data.accountId,
    });

    return success({
      videos: response.videos,
    });
  }

  private validate(data: GetAccountWatchedVideosController.Params): void {
    if (!data.accountId) {
      throw new MissingParamsError({
        params: ['accountId'],
      });
    }
  }
}
