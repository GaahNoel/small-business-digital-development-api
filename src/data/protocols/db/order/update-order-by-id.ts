import { OrderStatus } from '@prisma/client';
import { UpdateOrderById } from '@/domain/usecases/order/update-order-by-id';

export namespace UpdateOrderByIdRepository {
  export type Params = UpdateOrderById.Params;
  export type Result = {
    orderId: string;
    status: OrderStatus;
    buyerStatus?: OrderStatus;
    sellerStatus?: OrderStatus;
    total: number;
    accountBonusId?: string
  };
}

export interface UpdateOrderByIdRepository {
  updateOrderById(params: UpdateOrderByIdRepository.Params): Promise<UpdateOrderByIdRepository.Result>;
}
