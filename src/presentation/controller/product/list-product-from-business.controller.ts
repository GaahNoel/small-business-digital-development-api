import { ListProductFromBusiness } from '@/domain/usecases/product';
import { internalServerError, success } from '@/presentation/helpers/http.helpers';
import { BaseController, HttpResponse } from '@/presentation/protocols';

export class ListProductFromBusinessController implements BaseController {
  constructor(private readonly listProductFromBusiness: ListProductFromBusiness) {}

  async handle(params: ListProductFromBusiness.Params): Promise<HttpResponse> {
    const response = await this.listProductFromBusiness.list({
      businessId: params.businessId,
    });

    return success(response);
  }
}
