import { ListAccountOrders } from '@/domain/usecases/order/list-account-orders';

namespace ListAccountOrdersRepository {
  export type Params = ListAccountOrders.Params;
  export type Result = ListAccountOrders.Result;
}

export interface ListAccountOrdersRepository {
  listAccountOrders(params: ListAccountOrders.Params): Promise<ListAccountOrders.Result>;
}
