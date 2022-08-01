import { ListAccountOrders } from '@/domain/usecases/order';
import { MissingParamsError } from '@/presentation/errors';
import { badRequest, internalServerError, success } from '@/presentation/helpers/http.helpers';
import { BaseController, HttpResponse } from '@/presentation/protocols';

type MappedOrderType = {
  business: {
    name: string;
    id: string;
  },
  orders: Array<{
    id: string;
    status: 'PENDING' | 'COMPLETED' | 'CANCELED';
    total: number;
    createdAt?: Date;
    updatedAt?: Date;
    buyerId: string;
    sellerId: string;
    items:Array<{
      id: string,
      quantity: number,
      product: {
        id: string;
        name: string,
        description: string,
        salePrice: number,
        listPrice: number,
        imageUrl: string,
      }
    }>
  }>,
};
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
    this.validate(params);
    const result = await this.listAccountOrders.listAccountOrders(params);

    const mappedOrder: MappedOrderType[] = [];

    result.forEach(async (order) => {
      const foundBusiness = mappedOrder.find((o) => o.business.id === order.Business.id);

      if (foundBusiness) {
        foundBusiness.orders.push({
          id: order.id,
          status: order.status,
          total: order.total,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
          items: order.items,
          buyerId: order.buyerId,
          sellerId: order.sellerId,
        });
      } else {
        mappedOrder.push({
          business: {
            name: order.Business.name,
            id: order.Business.id,
          },
          orders: [{
            id: order.id,
            status: order.status,
            total: order.total,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            items: order.items,
            buyerId: order.buyerId,
            sellerId: order.sellerId,
          }],
        });
      }
    });

    return success(mappedOrder);
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
