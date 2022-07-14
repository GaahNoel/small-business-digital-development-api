import { Order } from '@/domain/models/order';
import { GetOrderById } from '@/domain/usecases/order/get-order-by-id';

export namespace GetOrderByIdRepository {
  export type Params = GetOrderById.Params;
  export type Result = Order;
}

export interface GetOrderByIdRepository {
  getOrderById(params: GetOrderByIdRepository.Params): Promise<GetOrderByIdRepository.Result>;
}
