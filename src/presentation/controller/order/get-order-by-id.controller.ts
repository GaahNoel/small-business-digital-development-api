import { GetOrderById } from '@/domain/usecases/order';
import { MissingParamsError, NotFound } from '@/presentation/errors';
import {
  badRequest, internalServerError, notFound, success,
} from '@/presentation/helpers/http.helpers';
import { BaseController, HttpResponse } from '@/presentation/protocols';

namespace GetOrderByIdController {
  export type Params = {
    orderId: string
  };
  export type Result = HttpResponse;
}

export class GetOrderByIdController implements BaseController {
  constructor(private readonly getOrderById: GetOrderById) {}

  async handle(params: GetOrderByIdController.Params): Promise<GetOrderByIdController.Result> {
    try {
      this.validate(params);
      const order = await this.getOrderById.getOrderById({
        orderId: params.orderId,
      });
      return success(order);
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

  private validate(data: GetOrderByIdController.Params): void {
    const { orderId } = data;
    if (!orderId) {
      throw new MissingParamsError({
        params: ['orderId'],
      });
    }
  }
}
