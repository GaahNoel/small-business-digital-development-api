import { OrderItem } from '@/domain/models/order';
import { ListBusinessById } from '@/domain/usecases/business';
import { CreateOrder } from '@/domain/usecases/order';
import { MissingParamsError } from '@/presentation/errors';
import { badRequest, internalServerError, success } from '@/presentation/helpers/http.helpers';
import { BaseController, HttpResponse } from '@/presentation/protocols';

namespace CreateOrderController {
  export type Params = {
    businessId: string;
    buyerId: string;
    total: number;
    items: OrderItem[];
  };
  export type Result = HttpResponse;

}

export class CreateOrderController implements BaseController {
  constructor(private readonly createOrder: CreateOrder) {}

  async handle(data: CreateOrderController.Params): Promise<CreateOrderController.Result> {
    try {
      this.validate(data);
      const order = await this.createOrder.create({
        businessId: data.businessId,
        buyerId: data.buyerId,
        total: data.total,
        items: data.items,
      });
      return success(order);
    } catch (error) {
      if (error instanceof MissingParamsError) {
        return badRequest(error);
      }

      return internalServerError(error);
    }
  }

  private validate(data: CreateOrderController.Params): void {
    const {
      businessId, buyerId, total, items,
    } = data;

    const missingParams = [];
    if (!businessId) {
      missingParams.push('businessId');
    }
    if (!buyerId) {
      missingParams.push('buyerId');
    }
    if (!total) {
      missingParams.push('total');
    }
    if (!items) {
      missingParams.push('items');
    }

    if (missingParams.length > 0) {
      throw new MissingParamsError({
        params: missingParams,
      });
    }
  }
}
