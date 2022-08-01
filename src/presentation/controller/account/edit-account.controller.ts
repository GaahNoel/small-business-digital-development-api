import { EditAccount } from '@/domain/usecases/account';
import { MissingParamsError } from '@/presentation/errors';
import { badRequest, internalServerError, success } from '@/presentation/helpers/http.helpers';
import { BaseController, HttpResponse } from '@/presentation/protocols';
import { removeAuthParams } from '@/utils/handle-auth-params/remove-auth-params';

namespace EditAccountController {
  export type Params = {
    id: string;
    email?: string;
    password?: string;
    name?: string;
  };

  export type Result = HttpResponse;
}

export class EditAccountController implements BaseController {
  constructor(private readonly editAccount: EditAccount) {}

  async handle(data: EditAccountController.Params): Promise<EditAccountController.Result> {
    const removedAuthData = removeAuthParams(data);
    this.paramsValidator(removedAuthData);

    const result = await this.editAccount.edit(removedAuthData);

    return success(result);
  }

  private paramsValidator(data: EditAccountController.Params): void {
    const { id, ...params } = data;
    const notHasAccountId = !id;
    const notHasAnyParams = Object.keys(params).length <= 0;
    const missingParams = [];

    if (notHasAccountId) {
      missingParams.push('id');
    }

    if (notHasAnyParams) {
      missingParams.push('name');
      missingParams.push('password');
      missingParams.push('email');
    }

    if (missingParams.length > 0) {
      throw new MissingParamsError({
        params: missingParams,
      });
    }
  }
}
