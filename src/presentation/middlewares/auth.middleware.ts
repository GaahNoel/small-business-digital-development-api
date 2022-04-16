import { AuthAccount } from '@/domain/usecases/account/auth-account';
import { Middleware, HttpResponse } from '@/presentation/protocols';
import { AccessDeniedError } from '@/presentation/errors/access-denied.error';
import { forbidden, internalServerError, success } from '@/presentation/helpers/http.helpers';

namespace AuthMiddleware {
  export type Request = {
    token: string;
  };
}
export class AuthMiddleware implements Middleware {
  constructor(
    private readonly authAccount: AuthAccount,
  ) {}

  async handle(request: AuthMiddleware.Request): Promise<HttpResponse> {
    try {
      const { token } = request;
      if (!token) {
        return forbidden(new AccessDeniedError('Permission Denied'));
      }

      const account = await this.authAccount.auth({
        token,
      });

      if (!account) {
        return forbidden(new AccessDeniedError('Permission Denied'));
      }

      return success({ accountId: account.id });
    } catch (error) {
      return internalServerError(error);
    }
  }
}
