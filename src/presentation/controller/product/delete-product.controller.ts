import { DeleteProduct } from '@/domain/usecases/product';
import { MissingParamsError } from '@/presentation/errors';
import { badRequest, internalServerError, success } from '@/presentation/helpers/http.helpers';
import { BaseController, HttpResponse } from '@/presentation/protocols';

namespace DeleteProductController {
  export type Params = {
    productId: string
  };
  export type Result = HttpResponse;
}
export class DeleteProductController implements BaseController {
  constructor(private readonly deleteProduct: DeleteProduct) {}

  async handle(params: DeleteProductController.Params): Promise<HttpResponse> {
    try {
      this.validate(params);
      const result = await this.deleteProduct.delete({
        productId: params.productId,
      });
      return success({
        id: result.id,
        delete: true,
      });
    } catch (error) {
      if (error instanceof MissingParamsError) {
        return badRequest(error);
      }
      return internalServerError(error);
    }
  }

  private validate(data :DeleteProductController.Params): void {
    if (!data.productId) {
      throw new MissingParamsError({
        params: ['productId'],
      });
    }
  }
}
