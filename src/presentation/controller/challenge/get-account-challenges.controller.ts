import { GetAccountChallenges } from '@/domain/usecases/challenge';
import { MissingParamsError, NotFound } from '@/presentation/errors';
import {
  badRequest, internalServerError, notFound, success,
} from '@/presentation/helpers/http.helpers';
import { BaseController, HttpResponse } from '@/presentation/protocols';

namespace GetAccountChallengesController {
  export type Params = {
    accountId: string;
  };
  export type Result = HttpResponse;
}

export class GetAccountChallengesController implements BaseController {
  constructor(private readonly getAccountChallenges: GetAccountChallenges) {}

  async handle(params: GetAccountChallengesController.Params): Promise<GetAccountChallengesController.Result> {
    this.validate(params);
    const accountChallenges = await this.getAccountChallenges.getAccountChallenges({
      accountId: params.accountId,
    });
    return success(accountChallenges);
  }

  private validate(params: GetAccountChallengesController.Params): void {
    const { accountId } = params;
    if (!accountId) {
      throw new MissingParamsError({
        params: ['accountId'],
      });
    }
  }
}
