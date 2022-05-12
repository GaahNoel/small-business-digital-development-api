import { GetAccountByEmail } from '@/domain/usecases/account';
import { internalServerError, success } from '@/presentation/helpers/http.helpers';
import { BaseController, HttpResponse } from '@/presentation/protocols';

namespace GetAccountByEmailController {
  export type Request = {
    email: string;
  };
}

export class GetAccountByEmailController implements BaseController {
  constructor(private readonly getAccountByEmail: GetAccountByEmail) {}

  async handle(data: GetAccountByEmailController.Request): Promise<HttpResponse> {
    try {
      const result = await this.getAccountByEmail.get({
        email: data.email,
      });
      return success(result);
    } catch (error) {
      return internalServerError(error);
    }
  }
}
