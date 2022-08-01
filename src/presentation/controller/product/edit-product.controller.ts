import { EditProduct } from '@/domain/usecases/product';
import { MissingParamsError } from '@/presentation/errors';
import { badRequest, internalServerError, success } from '@/presentation/helpers/http.helpers';
import { BaseController, HttpResponse } from '@/presentation/protocols';
import { removeAuthParams } from '@/utils/handle-auth-params/remove-auth-params';

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
    const paramsWithoutAuth = removeAuthParams(params);
    this.validate(paramsWithoutAuth);
    const result = await this.editProduct.edit(paramsWithoutAuth);
    return success({
      productId: result.productId,
    });
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
