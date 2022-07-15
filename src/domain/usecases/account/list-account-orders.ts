import { OrderItem } from '@/domain/models/order';

type ListAccountBuyOrdersParams = {
  accountId: string;
  type: 'buy' | 'sell';
};

namespace ListAccountBuyOrders {
  export type Params = ListAccountBuyOrdersParams;
  export type Result = {
    id: string;
    businessId: string;
    buyerId: string;
    status: 'PENDING' | 'COMPLETED' | 'CANCELED';
    total: number;
    createdAt?: Date;
    updatedAt?: Date;
    items: OrderItem[];
  } [];
}

export interface ListAccountBuyOrders {
  (params: ListAccountBuyOrders.Params): Promise<ListAccountBuyOrders.Result>;
}
