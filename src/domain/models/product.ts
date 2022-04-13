export type ProductModel = {
  id: string;
  name: string;
  type: 'product' | 'service';
  description: string;
  listPrice: number;
  salePrice: number;
  imageUrl: string;
  businessId: string;
  categoryId: string;
  createdAt?: string;
};
