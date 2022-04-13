import { AddAccount } from '@/domain/usecases/account/add-account';
import { MissingParamsError } from '@/presentation/errors/missing-params.error';
import { badRequest, internalServerError, success } from '@/presentation/helpers/http.helpers';
import { BaseController } from '@/presentation/protocols/base-controller';
import { HttpResponse } from '@/presentation/protocols/http';

namespace SignUpController {
  export type Request = {
    name: string;
    email: string;
    password?: string;
  };
}
export class SignUpController implements BaseController<SignUpController.Request> {
  constructor(private readonly addAccount: AddAccount) {}

  async handle(data: SignUpController.Request): Promise<HttpResponse> {
    try {
      const { name, email } = data;

      if (!name || !email) {
        return badRequest(new MissingParamsError());
      }

      const accountAdded = await this.addAccount.add(data);

      return success(accountAdded);
    } catch (error) {
      return internalServerError(error as Error);
    }
  }
}
