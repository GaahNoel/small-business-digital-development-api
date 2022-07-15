import { EditProduct } from '@/domain/usecases/product';
import { MissingParamsError } from '@/presentation/errors';
import { badRequest, internalServerError, success } from '@/presentation/helpers/http.helpers';
import { BaseController, HttpResponse } from '@/presentation/protocols';

namespace EditProductController {
  export type Result = HttpResponse;
  export type Params = {
    productId: string;
    name?: string;
    description?: string;
    listPrice?: number;
    salePrice?: number;
    imageUrl?: string;
  };

}

export class EditProductController implements BaseController {
  constructor(private readonly editProduct: EditProduct) {}

  async handle(params: EditProductController.Params): Promise<EditProductController.Result> {
    try {
      this.validate(params);
      const result = await this.editProduct.edit(params);
      return success({
        productId: result.productId,
      });
    } catch (error) {
      if (error instanceof MissingParamsError) {
        return badRequest(error);
      }
      return internalServerError(error);
    }
  }

  private validate(params: EditProductController.Params): void {
    const { productId } = params;
    if (!productId) {
      throw new MissingParamsError({
        params: ['productId'],
      });
    }
  }
}
