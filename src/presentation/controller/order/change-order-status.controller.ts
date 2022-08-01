import { ChangeOrderStatus } from '@/domain/usecases/order/change-order-status';
import { MissingParamsError, NotFound } from '@/presentation/errors';
import {
  badRequest, internalServerError, notFound, success,
} from '@/presentation/helpers/http.helpers';
import { BaseController, HttpResponse } from '@/presentation/protocols';

export type ChangeOrderStatusControllerParams = {
  orderId: string;
  status: 'COMPLETED' | 'CANCELED'
  authAccountId: string,
};

namespace ChangeOrderStatusController {
  export type Params = ChangeOrderStatusControllerParams;
  export type Result = HttpResponse<ChangeOrderStatus.Result>;
}

export class ChangeOrderStatusController implements BaseController {
  constructor(private readonly changeOrderStatus: ChangeOrderStatus) {}

  async handle(data: ChangeOrderStatusController.Params): Promise<ChangeOrderStatusController.Result> {
    this.validate(data);
    const order = await this.changeOrderStatus.changeOrderStatus({
      orderId: data.orderId,
      status: data.status,
      accountId: data.authAccountId,
    });
    return success(order);
  }

  private validate(data: ChangeOrderStatusController.Params): void {
    const { orderId, status } = data;
    const missingParams = [];
    if (!orderId) {
      missingParams.push('orderId');
    }
    if (!status) {
      missingParams.push('status');
    }

    if (missingParams.length > 0) {
      throw new MissingParamsError({
        params: missingParams,
      });
    }
  }
}
