export type OrderItem = {
  id?: string;
  quantity: number;
  productId: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELED = 'CANCELED',
}

export type Order = {
  id: string;
  businessId: string;
  buyerId: string;
  status: OrderStatus;
  total: number;
  createdAt: Date;
  updatedAt: Date;
  items: OrderItem[];
};
