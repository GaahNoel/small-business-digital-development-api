import { Order } from '@/domain/models/order';

type GetOrderByIdParams = {
  orderId: string;
};

export namespace GetOrderById {
  export type Params = GetOrderByIdParams;
  export type Result = Order;
}

export interface GetOrderById {
  getOrderById(params: GetOrderById.Params): Promise<GetOrderById.Result>;
}
