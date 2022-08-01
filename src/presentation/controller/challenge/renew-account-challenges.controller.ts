import { GetAccountById } from '@/domain/usecases/account';
import { RenewAccountChallenges } from '@/domain/usecases/challenge';
import { MissingParamsError, NotFound } from '@/presentation/errors';
import { InvalidParamsError } from '@/presentation/errors/invalid-params.error';
import {
  badRequest, internalServerError, notFound, success,
} from '@/presentation/helpers/http.helpers';
import { BaseController, HttpResponse } from '@/presentation/protocols';

namespace RenewAccountChallengesController {
  export type Params = {
    accountId: string;
    periodicity: 'daily' | 'weekly';
  };
  export type Result = HttpResponse;

}

export class RenewAccountChallengesController implements BaseController {
  constructor(private readonly renewAccountChallenges: RenewAccountChallenges, private readonly getAccountById: GetAccountById) {}

  async handle(data: RenewAccountChallengesController.Params): Promise<RenewAccountChallengesController.Result> {
    this.validate(data);
    const account = await this.getAccountById.getById({
      accountId: data.accountId,
    });

    if (!account) {
      throw new NotFound({
        entity: 'Account',
      });
    }

    const result = await this.renewAccountChallenges.renew({
      accountId: data.accountId,
      periodicity: data.periodicity,
    });
    return success(result);
  }

  private validate(data: RenewAccountChallengesController.Params): void {
    const missingParams = [];

    if (!data.accountId) {
      missingParams.push('accountId');
    }

    if (!data.periodicity) {
      missingParams.push('periodicity');
    }

    if (missingParams.length > 0) {
      throw new MissingParamsError({
        params: missingParams,
      });
    }

    if (data.periodicity !== 'daily' && data.periodicity !== 'weekly') {
      throw new InvalidParamsError({
        params: ['periodicity'],
      });
    }
  }
}
