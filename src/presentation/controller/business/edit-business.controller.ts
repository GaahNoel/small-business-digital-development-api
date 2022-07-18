import { EditBusiness } from '@/domain/usecases/business';
import { MissingParamsError } from '@/presentation/errors';
import { badRequest, internalServerError, success } from '@/presentation/helpers/http.helpers';
import { BaseController, HttpResponse } from '@/presentation/protocols';

namespace EditBusinessController{
  export type Props = EditBusiness.Params;
  export type Response = HttpResponse;
}

export class EditBusinessController implements BaseController {
  constructor(private readonly editBusiness: EditBusiness) {}

  async handle(data: EditBusinessController.Props): Promise<HttpResponse> {
    try {
      this.validate(data);

      const response = await this.editBusiness.edit(data);
      return success({
        id: response.id,
      });
    } catch (error) {
      if (error instanceof MissingParamsError) {
        return badRequest(error);
      }
      return internalServerError(error);
    }
  }

  private validate(data: EditBusinessController.Props): void {
    if (!data.businessId) {
      throw new MissingParamsError({
        params: ['businessId'],
      });
    }
  }
}
