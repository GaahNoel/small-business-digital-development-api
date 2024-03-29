import { AddAccount } from '@/domain/usecases/account/add-account';
import { RenewAccountChallenges } from '@/domain/usecases/challenge';
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
  constructor(private readonly addAccount: AddAccount, private readonly renewAccountChallenges: RenewAccountChallenges) {}

  async handle(data: SignUpController.Request): Promise<HttpResponse> {
    this.validateParams(data);

    const accountAdded = await this.addAccount.add({
      name: data.name,
      email: data.email,
      password: data.password,
      provider: data.provider,
    });

    if (accountAdded.created) {
      await this.renewAccountChallenges.renew({
        accountId: accountAdded.id,
        periodicity: 'daily',
      });

      await this.renewAccountChallenges.renew({
        accountId: accountAdded.id,
        periodicity: 'weekly',
      });
    }

    return success({
      id: accountAdded.id,
      created: accountAdded.created,
    });
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
