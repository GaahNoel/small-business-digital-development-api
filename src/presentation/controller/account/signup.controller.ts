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
    provider: 'socialMedia' | 'credentials';
  };
}
export class SignUpController implements BaseController<SignUpController.Request> {
  constructor(private readonly addAccount: AddAccount) {}

  async handle(data: SignUpController.Request): Promise<HttpResponse> {
    try {
      this.validateParams(data);
      const accountAdded = await this.addAccount.add(data);

      return success({
        id: accountAdded.id,
        created: accountAdded.created,
      });
    } catch (error) {
      if (error instanceof MissingParamsError) {
        return badRequest(error);
      }

      return internalServerError(error as Error);
    }
  }

  private validateParams(data: SignUpController.Request): void {
    if (!data.name) {
      throw new MissingParamsError({
        params: ['name'],
      });
    }

    if (!data.email) {
      throw new MissingParamsError({
        params: ['email'],
      });
    }

    if (data.provider === 'credentials') {
      if (!data.password) {
        throw new MissingParamsError({
          params: ['password'],
        });
      }
    }
  }
}
