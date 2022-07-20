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
  sellerId: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELED';
  total: number;
  createdAt?: Date;
  updatedAt?: Date;
  description?: string;
  paymentMethod: 'CreditCard' | 'Cash'
  change?: number;
  items: OrderItem[];
};
