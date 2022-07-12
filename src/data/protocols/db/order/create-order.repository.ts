import { CreateOrder } from '@/domain/usecases/order';

export interface CreateOrderRepository {
  create(order: CreateOrderRepository.Params): Promise<CreateOrderRepository.Result>;
}

export namespace CreateOrderRepository {
  export type Params = CreateOrder.Params;
  export type Result = CreateOrder.Result;
}
