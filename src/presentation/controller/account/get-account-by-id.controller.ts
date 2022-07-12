import { GetAccountById } from '@/domain/usecases/account';
import { NotFound } from '@/presentation/errors';
import { internalServerError, notFound, success } from '@/presentation/helpers/http.helpers';
import { BaseController, HttpResponse } from '@/presentation/protocols';

namespace GetAccountByIdController {
  export type Params = GetAccountById.Params;
  export type Result = HttpResponse;
}

export class GetAccountByIdController implements BaseController {
  constructor(private readonly getAccountById: GetAccountById) {}

  async handle(params: GetAccountByIdController.Params): Promise<GetAccountByIdController.Result> {
    try {
      const result = await this.getAccountById.getById({
        accountId: params.accountId,
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
