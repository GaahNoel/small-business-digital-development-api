import { OrderItem } from '@/domain/models/order';

type CreateOrderParams = {
  businessId: string;
  buyerId: string;
  sellerId?: string;
  total: number;
  description?: string;
  paymentMethod: 'CreditCard' | 'Cash'
  change?: number;
  items: OrderItem[];
  latitude?: number;
  longitude?: number;
  couponId?: string;
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
