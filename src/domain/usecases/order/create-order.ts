import { OrderItem } from '@/domain/models/order';

type CreateOrderParams = {
  businessId: string;
  buyerId: string;
  total: number;
  items: OrderItem[];
};

export namespace CreateOrder {
  export type Params = CreateOrderParams;
  export type Result = {
    orderId: string;
  };
}

export interface CreateOrder {
  create(order: CreateOrder.Params): Promise<CreateOrder.Result>;
}
