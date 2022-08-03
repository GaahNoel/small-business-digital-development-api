type UpdateOrderByIdParams = {
  orderId: string;
  status?: 'CANCELED' | 'COMPLETED' | 'PENDING';
  total?: number;
  statusType?: 'order' | 'buyer' | 'seller';
};

export namespace UpdateOrderById {
  export type Params = UpdateOrderByIdParams;
  export type Result = {
    orderId: string;
    status: 'CANCELED' | 'COMPLETED' | 'PENDING';
    total: number;
  };
}

export interface UpdateOrderById {
  updateOrderById(params: UpdateOrderById.Params): Promise<UpdateOrderById.Result>;
}
