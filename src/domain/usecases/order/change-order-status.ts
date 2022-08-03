import { OrderStatus } from '@/domain/models/order';

type ChangeOrderStatusParams = {
  accountId: string;
  orderId: string;
  status: 'CANCELED' | 'COMPLETED'
};

export namespace ChangeOrderStatus {
  export type Params = ChangeOrderStatusParams;
  export type Result = {
    orderId: string;
    status: OrderStatus;
    buyerStatus: OrderStatus,
    sellerStatus: OrderStatus,
  };
}

export interface ChangeOrderStatus {
  changeOrderStatus(params: ChangeOrderStatusParams): Promise<ChangeOrderStatus.Result>;
}
