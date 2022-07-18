import { UpdateOrderById } from '@/domain/usecases/order/update-order-by-id';

export namespace UpdateOrderByIdRepository {
  export type Params = UpdateOrderById.Params;
  export type Result = {
    orderId: string;
    status: 'CANCELED' | 'COMPLETED' | 'PENDING';
    total: number;
  };
}

export interface UpdateOrderByIdRepository {
  updateOrderById(params: UpdateOrderByIdRepository.Params): Promise<UpdateOrderByIdRepository.Result>;
}
