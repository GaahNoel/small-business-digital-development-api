type GetOrderByIdParams = {
  orderId: string;
};

export namespace GetOrderById {
  export type Params = GetOrderByIdParams;
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
    latitude: number;
    longitude: number;
  };
}

export interface GetOrderById {
  getOrderById(params: GetOrderById.Params): Promise<GetOrderById.Result>;
}
