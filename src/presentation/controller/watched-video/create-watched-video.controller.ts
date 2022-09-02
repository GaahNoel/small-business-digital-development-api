import { GetAccountById } from '@/domain/usecases/account';
import { CreateWatchedVideo } from '@/domain/usecases/watched-video';
import { MissingParamsError, NotFound } from '@/presentation/errors';
import { success } from '@/presentation/helpers/http.helpers';
import { BaseController, HttpResponse } from '@/presentation/protocols';

namespace CreateWatchedVideoController {
  export type Params = {
    accountId: string,
    url?: string,
  };
  export type Result = HttpResponse<{
    watchedVideoId: string,
  }>;
}

export class CreateWatchedVideoController implements BaseController {
  constructor(private readonly createWatchedVideo: CreateWatchedVideo, private readonly getAccountById: GetAccountById) {}

  async handle(data: CreateWatchedVideoController.Params): Promise<CreateWatchedVideoController.Result> {
    this.validate(data);
    const account = await this.getAccountById.getById({
      accountId: data.accountId,
    });

    if (!account) {
      throw new NotFound({
        entity: 'Account',
      });
    }

    const response = await this.createWatchedVideo.create({
      accountId: data.accountId,
      url: data.url,
    });

    return success(response);
  }

  private validate(data: CreateWatchedVideoController.Params): void {
    if (!data.accountId) {
      throw new MissingParamsError({
        params: ['accountId'],
      });
    }
  }
}
