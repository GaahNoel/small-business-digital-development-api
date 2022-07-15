import { ListAccountOrders } from '@/domain/usecases/order';
import { MissingParamsError } from '@/presentation/errors';
import { badRequest, internalServerError, success } from '@/presentation/helpers/http.helpers';
import { BaseController, HttpResponse } from '@/presentation/protocols';

namespace ListAccountOrdersController {
  export type Params = {
    accountId: string;
    type: 'buy' | 'sell';
  };
  export type Result = HttpResponse;
}
export class ListAccountOrdersController implements BaseController {
  constructor(private readonly listAccountOrders: ListAccountOrders) {}

  async handle(params: ListAccountOrdersController.Params): Promise<ListAccountOrdersController.Result> {
    try {
      this.validate(params);
      const result = await this.listAccountOrders.listAccountOrders(params);

      return success(result);
    } catch (error) {
      if (error instanceof MissingParamsError) {
        return badRequest(error);
      }

      return internalServerError(error);
    }
  }

  private validate(data: ListAccountOrdersController.Params): void {
    const missingParams = [];

    if (!data.accountId) {
      missingParams.push('accountId');
    }

    if (!data.type) {
      missingParams.push('type');
    }

    if (missingParams.length > 0) {
      throw new MissingParamsError({
        params: missingParams,
      });
    }
  }
}
