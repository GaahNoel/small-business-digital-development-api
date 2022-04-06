import { ProductModel } from '../models/product';
import { AddProduct } from '../usecases/product/add-product';

export const mockAddProductParams = (businessId = 'any_business_id', categoryId = 'any_category_id'): AddProduct.Params => ({
  name: 'any_name',
  type: 'product',
  description: 'any_description',
  listPrice: 11111,
  salePrice: 11111,
  imageUrl: 'any_image_url',
  businessId,
  categoryId,
});

export const mockAddProductModel = (): ProductModel => ({
  id: 'any_id',
  ...mockAddProductParams(),
});
