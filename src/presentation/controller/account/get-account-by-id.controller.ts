import { GetAccountById } from '@/domain/usecases/account';
import { success } from '@/presentation/helpers/http.helpers';
import { BaseController, HttpResponse } from '@/presentation/protocols';

namespace GetAccountByIdController {
  export type Params = GetAccountById.Params;
  export type Result = HttpResponse;
}

export class GetAccountByIdController implements BaseController {
  constructor(private readonly getAccountById: GetAccountById) {}

  async handle(params: GetAccountByIdController.Params): Promise<GetAccountByIdController.Result> {
    const result = await this.getAccountById.getById({
      accountId: params.accountId,
    });

    return success(result);
  }
}
