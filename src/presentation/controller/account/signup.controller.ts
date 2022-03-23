import { AddAccount } from '@/domain/usecases/account/add-account';
import { InternalServerError } from '@/presentation/errors/internal-server.error';
import { MissingParamsError } from '@/presentation/errors/missing-params.error';
import { badRequest, internalServerError, success } from '@/presentation/helpers/http.helpers';
import { BaseController } from '@/presentation/protocols/base-controller';
import { HttpRequest, HttpResponse } from '@/presentation/protocols/http';

export class SignUpController implements BaseController {
  constructor(private readonly addAccount: AddAccount) {}

  async handle(data: HttpRequest): Promise<HttpResponse> {
    try {
      const { name, email } = data.body;

      if (!name || !email) {
        return badRequest(new MissingParamsError());
      }

      const accountAdded = await this.addAccount.add(data.body);

      return success(accountAdded);
    } catch (error) {
      return internalServerError(error as Error);
    }
  }
}
