export type OrderItem = {
  id?: string;
  quantity: number;
  productId: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type Order = {
  id: string;
  businessId: string;
  buyerId: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELED';
  total: number;
  createdAt?: Date;
  updatedAt?: Date;
  items: OrderItem[];
};
