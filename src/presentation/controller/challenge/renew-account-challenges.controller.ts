import { GetAccountById } from '@/domain/usecases/account';
import { RenewAccountChallenges } from '@/domain/usecases/challenge';
import { NotFound } from '@/presentation/errors';
import { internalServerError, notFound, success } from '@/presentation/helpers/http.helpers';
import { BaseController, HttpResponse } from '@/presentation/protocols';

namespace RenewAccountChallengesController {
  export type Params = {
    accountId: string;
  };
  export type Result = HttpResponse;

}

export class RenewAccountChallengesController implements BaseController {
  constructor(private readonly renewAccountChallenges: RenewAccountChallenges, private readonly getAccountById: GetAccountById) {}

  async handle(data: RenewAccountChallengesController.Params): Promise<RenewAccountChallengesController.Result> {
    try {
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
      });
      return success(result);
    } catch (error) {
      if (error instanceof NotFound) {
        return notFound(error);
      }

      return internalServerError(error);
    }
  }
}
