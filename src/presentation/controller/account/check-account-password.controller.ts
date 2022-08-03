import { CheckAccountPassword } from '@/domain/usecases/account/check-account-password';
import { NotFound } from '@/presentation/errors';
import { MissingParamsError } from '@/presentation/errors/missing-params.error';
import {
  badRequest, internalServerError, notFound, success,
} from '@/presentation/helpers/http.helpers';
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
    this.validateParams(data);

    const result = await this.checkAccountPassword.check({
      email: data.email,
      password: data.password,
    });

    return success(result);
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
