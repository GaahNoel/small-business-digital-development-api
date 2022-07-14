type ChangeOrderStatusParams = {
  orderId: string;
  status: 'CANCELED' | 'COMPLETED'
};

export namespace ChangeOrderStatus {
  export type Params = ChangeOrderStatusParams;
  export type Result = {
    orderId: string;
    status: 'CANCELED' | 'COMPLETED' | 'PENDING';
  };
}

export interface ChangeOrderStatus {
  changeOrderStatus(params: ChangeOrderStatusParams): Promise<ChangeOrderStatus.Result>;
}
