import { EditAccount } from '@/domain/usecases/account';
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
    try {
      const removedAuthData = removeAuthParams(data);
      if (!this.paramsValidator(removedAuthData)) {
        return badRequest(new Error());
      }

      const result = await this.editAccount.edit(removedAuthData);

      return success(result);
    } catch (error) {
      return internalServerError(error);
    }
  }

  private paramsValidator(data: EditAccountController.Params): boolean {
    const { id, ...params } = data;
    const notHasAccountId = !id;
    const notHasAnyParams = Object.keys(params).length <= 0;

    if (notHasAccountId || notHasAnyParams) {
      return false;
    }

    return true;
  }
}
