import { AddAccount } from '@/domain/usecases/account/add-account';
import { MissingParamsError } from '@/presentation/errors/missing-params.error';
import { badRequest } from '@/presentation/helpers/http.helpers';
import { BaseController } from '@/presentation/protocols/base-controller';
import { HttpRequest, HttpResponse } from '@/presentation/protocols/http';

export class SignUpController implements BaseController {
  constructor(private readonly addAccount: AddAccount) {}

  async handle(data: HttpRequest): Promise<HttpResponse> {
    const { name, email, password } = data.body;

    if (!name || !email) {
      return badRequest(new MissingParamsError());
    }

    const response = await this.addAccount.add(data.body);

    return Promise.resolve({
      statusCode: 0,
      body: null
    });
  }
}
