import { VerifyAccount } from '@/domain/usecases/account/verify-account';
import { internalServerError, success } from '@/presentation/helpers/http.helpers';
import { BaseController, HttpResponse } from '@/presentation/protocols';

namespace VerifyAccountController {
  export type Request = {
    id: string;
  };
}

export class VerifyAccountController implements BaseController {
  constructor(private readonly verifyAccount: VerifyAccount) {}

  async handle(data: VerifyAccountController.Request): Promise<HttpResponse> {
    try {
      const result = await this.verifyAccount.verify(data.id);

      return success(result);
    } catch (error) {
      return internalServerError(error);
    }
  }
}
