import { Order } from '@/domain/models/order';
import { GetOrderById } from '@/domain/usecases/order/get-order-by-id';

export namespace GetOrderByIdRepository {
  export type Params = GetOrderById.Params;
  export type Result = {
    id: string;
    businessId: string;
    buyerId: string;
    sellerId: string;
    status: 'PENDING' | 'COMPLETED' | 'CANCELED';
    total: number;
    createdAt?: Date;
    updatedAt?: Date;
    description?: string;
    paymentMethod: 'CreditCard' | 'Cash'
    change?: number;
    items: {
      id: string;
      quantity: number;
      product: {
        id: string;
        name: string;
        description: string;
        salePrice: number;
        listPrice: number;
        imageUrl: string;
        type: 'product' | 'service';
      }
    }[];
    sellerStatus: 'PENDING' | 'COMPLETED' | 'CANCELED';
    buyerStatus: 'PENDING' | 'COMPLETED' | 'CANCELED';
    latitude: string;
    longitude: string;
  };
}

export interface GetOrderByIdRepository {
  getOrderById(params: GetOrderByIdRepository.Params): Promise<GetOrderByIdRepository.Result>;
}
