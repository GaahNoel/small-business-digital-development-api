import { ListBusinessFromAccount } from '@/domain/usecases/business';
import { internalServerError, success } from '@/presentation/helpers/http.helpers';
import { BaseController, HttpResponse } from '@/presentation/protocols';

export class ListBusinessFromAccountController implements BaseController {
  constructor(private readonly listBusinessFromAccount: ListBusinessFromAccount) {}

  async handle(params: ListBusinessFromAccount.Params): Promise<HttpResponse> {
    const response = await this.listBusinessFromAccount.list({
      accountId: params.accountId,
    });

    return success(response);
  }
}
