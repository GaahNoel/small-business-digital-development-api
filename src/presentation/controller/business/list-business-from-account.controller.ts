import { ListBusinessFromAccount } from '@/domain/usecases/business';
import { internalServerError, success } from '@/presentation/helpers/http.helpers';
import { BaseController, HttpResponse } from '@/presentation/protocols';

export class ListBusinessFromAccountController implements BaseController {
  constructor(private readonly listBusinessFromAccount: ListBusinessFromAccount) {}

  async handle(params: ListBusinessFromAccount.Params): Promise<HttpResponse> {
    try {
      const response = await this.listBusinessFromAccount.list(params);

      return success(response);
    } catch (error) {
      return internalServerError(error);
    }
  }
}
