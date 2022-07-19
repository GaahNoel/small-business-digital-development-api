import { ListBusinessById } from '@/domain/usecases/business';
import { ListAccountOrders } from '@/domain/usecases/order';
import { MissingParamsError } from '@/presentation/errors';
import { badRequest, internalServerError, success } from '@/presentation/helpers/http.helpers';
import { BaseController, HttpResponse } from '@/presentation/protocols';

type MappedOrderType = {
  businessId: string,
  orders: Array<{
    id: string;
    status: 'PENDING' | 'COMPLETED' | 'CANCELED';
    total: number;
    createdAt?: Date;
    updatedAt?: Date;
    items: {
      id?: string;
      quantity: number;
      productId: string;
      createdAt?: Date;
      updatedAt?: Date;
    }[]
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
  constructor(private readonly listAccountOrders: ListAccountOrders, private readonly listBusinessById: ListBusinessById) {}

  async handle(params: ListAccountOrdersController.Params): Promise<ListAccountOrdersController.Result> {
    try {
      this.validate(params);
      const result = await this.listAccountOrders.listAccountOrders(params);

      const mappedOrderWithoutBusinessName: MappedOrderType[] = [];

      result.forEach(async (order) => {
        const foundBusiness = mappedOrderWithoutBusinessName.find((o) => o.businessId === order.businessId);

        if (foundBusiness) {
          foundBusiness.orders.push({
            id: order.id,
            status: order.status,
            total: order.total,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            items: order.items,
          });
        } else {
          mappedOrderWithoutBusinessName.push({
            businessId: order.businessId,
            orders: [{
              id: order.id,
              status: order.status,
              total: order.total,
              createdAt: order.createdAt,
              updatedAt: order.updatedAt,
              items: order.items,
            }],
          });
        }
      });

      const mappedOrderWithBusinessNamePromises = mappedOrderWithoutBusinessName.map(async (order) => {
        const business = await this.listBusinessById.list({
          businessId: order.businessId,
        });

        return {
          ...order,
          businessName: business.name,
        };
      });

      const mappedOrderWithBusinessName = await Promise.all(mappedOrderWithBusinessNamePromises);

      return success(mappedOrderWithBusinessName);
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
