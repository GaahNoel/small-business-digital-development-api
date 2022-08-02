import { OrderItem } from '@/domain/models/order';
import { CreateOrder } from '@/domain/usecases/order';

export interface CreateOrderRepository {
  create(order: CreateOrderRepository.Params): Promise<CreateOrderRepository.Result>;
}

export namespace CreateOrderRepository {
  export type Params = {
    businessId: string;
    buyerId: string;
    sellerId: string;
    total: number;
    description?: string;
    paymentMethod: 'CreditCard' | 'Cash'
    change?: number;
    items: OrderItem[];
    latitude?: number;
    longitude?: number;
    couponId?: string;
  };
  export type Result = CreateOrder.Result;
}
