type ListAccountOrdersParams = {
  accountId: string;
  type: 'buy' | 'sell';
};

export namespace ListAccountOrders {
  export type Params = ListAccountOrdersParams;
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

export interface ListAccountOrders {
  listAccountOrders(params: ListAccountOrders.Params): Promise<ListAccountOrders.Result>;
}
