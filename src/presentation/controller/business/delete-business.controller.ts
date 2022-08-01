import { DeleteBusiness } from '@/domain/usecases/business';
import { MissingParamsError } from '@/presentation/errors';
import { badRequest, internalServerError, success } from '@/presentation/helpers/http.helpers';
import { BaseController, HttpResponse } from '@/presentation/protocols';

namespace DeleteBusinessController {
  export type Params = {
    businessId: string;
  };
  export type Response = {
    delete: boolean;
    id: string;
  };
}

export class DeleteBusinessController implements BaseController {
  constructor(private readonly deleteBusiness: DeleteBusiness) {}

  async handle(params: DeleteBusinessController.Params): Promise<HttpResponse> {
    this.validate(params);
    const result = await this.deleteBusiness.delete({
      businessId: params.businessId,
    });

    return success({
      delete: true,
      id: result.id,
    });
  }

  private validate(params: DeleteBusinessController.Params): void {
    if (!params.businessId) {
      throw new MissingParamsError({
        params: ['businessId'],
      });
    }
  }
}
