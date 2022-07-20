import { ListAccountOrders } from '@/domain/usecases/order/list-account-orders';

export namespace ListAccountOrdersRepository {
  export type Params = ListAccountOrders.Params;
  export type Result = Array<{
    id: string;
    Business: {
      name: string;
      id: string;
    };
    sellerId: string;
    status: 'PENDING' | 'COMPLETED' | 'CANCELED';
    total: number;
    createdAt?: Date;
    updatedAt?: Date;
    buyerId: string;
    items:Array<{
      id: string,
      quantity: number,
      product: {
        id: string;
        name: string,
        description: string,
        salePrice: number,
        listPrice: number,
        imageUrl: string,
      }
    }>;
  }>;
}

export interface ListAccountOrdersRepository {
  listAccountOrders(params: ListAccountOrdersRepository.Params): Promise<ListAccountOrdersRepository.Result>;
}
