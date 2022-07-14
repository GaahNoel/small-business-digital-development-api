type GetOrderByIdParams = {
  orderId: string;
};

export namespace GetOrderById {
  export type Params = GetOrderByIdParams;
  export type Result = {
    orderId: string;
    status: 'CANCELED' | 'COMPLETED' | 'PENDING';
  };
}

export interface GetOrderById {
  getOrderById(params: GetOrderById.Params): Promise<GetOrderById.Result>;
}
