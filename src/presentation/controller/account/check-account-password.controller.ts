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
      this.validateParams(data);

      const result = await this.checkAccountPassword.check({
        email: data.email,
        password: data.password,
      });

      return success(result);
    } catch (error) {
      if (error instanceof MissingParamsError) {
        return badRequest(error);
      }

      return internalServerError(error);
    }
  }

  private validateParams(data: CheckAccountPasswordController.Request): void {
    if (!data.email) {
      throw new MissingParamsError({
        params: ['email'],
      });
    }

    if (!data.password) {
      throw new MissingParamsError({
        params: ['password'],
      });
    }
  }
}
