import { GetProductById } from '@/domain/usecases/product';
import { MissingParamsError, NotFound } from '@/presentation/errors';
import {
  badRequest, internalServerError, notFound, success,
} from '@/presentation/helpers/http.helpers';
import { BaseController, HttpResponse } from '@/presentation/protocols';

namespace GetProductByIdController {
  export type Params = {
    productId: string
  };
  export type Result = HttpResponse;
}

export class GetProductByIdController implements BaseController {
  constructor(private readonly getProductById: GetProductById) {}

  async handle(params: GetProductByIdController.Params): Promise<GetProductByIdController.Result> {
    try {
      this.validate(params);
      const result = await this.getProductById.get({
        productId: params.productId,
      });

      return success(result);
    } catch (error) {
      if (error instanceof MissingParamsError) {
        return badRequest(error);
      }

      if (error instanceof NotFound) {
        return notFound(error);
      }

      return internalServerError(error);
    }
  }

  private validate(params: GetProductById.Params): void {
    if (!params.productId) {
      throw new MissingParamsError({
        params: ['productId'],
      });
    }
  }
}
