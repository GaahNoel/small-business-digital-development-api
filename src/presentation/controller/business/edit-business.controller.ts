import { EditBusiness } from '@/domain/usecases/business';
import { MissingParamsError } from '@/presentation/errors';
import { badRequest, internalServerError, success } from '@/presentation/helpers/http.helpers';
import { BaseController, HttpResponse } from '@/presentation/protocols';
import { removeAuthParams } from '@/utils/handle-auth-params/remove-auth-params';

namespace EditBusinessController{
  export type Props = EditBusiness.Params;
  export type Response = HttpResponse;
}

export class EditBusinessController implements BaseController {
  constructor(private readonly editBusiness: EditBusiness) {}

  async handle(data: EditBusinessController.Props): Promise<HttpResponse> {
    const removedAuthData = removeAuthParams(data);
    this.validate(removedAuthData);

    const response = await this.editBusiness.edit(removedAuthData);
    return success({
      id: response.id,
    });
  }

  private validate(data: EditBusinessController.Props): void {
    if (!data.businessId) {
      throw new MissingParamsError({
        params: ['businessId'],
      });
    }
  }
}
