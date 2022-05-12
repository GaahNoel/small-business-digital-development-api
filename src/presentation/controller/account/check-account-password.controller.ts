import { CheckAccountPassword } from '@/domain/usecases/account/check-account-password';
import { MissingParamsError } from '@/presentation/errors/missing-params.error';
import { badRequest, internalServerError, success } from '@/presentation/helpers/http.helpers';
import { BaseController, HttpResponse } from '@/presentation/protocols';

namespace CheckAccountPasswordController {
  export type Request = {
    email: string;
    password: string;
  };
}

export class CheckAccountPasswordController implements BaseController {
  constructor(private readonly checkAccountPassword: CheckAccountPassword) {}

  async handle(data: CheckAccountPasswordController.Request): Promise<HttpResponse> {
    try {
      if (!data.email || !data.password) {
        return badRequest(new MissingParamsError());
      }

      const result = await this.checkAccountPassword.check({
        email: data.email,
        password: data.password,
      });

      return success(result);
    } catch (error) {
      return internalServerError(error);
    }
  }
}
