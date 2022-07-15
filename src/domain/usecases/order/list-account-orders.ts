import { OrderItem } from '@/domain/models/order';

type ListAccountOrdersParams = {
  accountId: string;
  type: 'buy' | 'sell';
};

export namespace ListAccountOrders {
  export type Params = ListAccountOrdersParams;
  export type Result = {
    id: string;
    businessId: string;
    sellerId: string;
    status: 'PENDING' | 'COMPLETED' | 'CANCELED';
    total: number;
    createdAt?: Date;
    updatedAt?: Date;
    items: OrderItem[];
  } [];
}

export interface ListAccountOrders {
  listAccountOrders(params: ListAccountOrders.Params): Promise<ListAccountOrders.Result>;
}
