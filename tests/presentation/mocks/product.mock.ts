import { AddProduct } from '@/domain/usecases/product/add-product';
import { mockAddProductModel } from '@/tests/domain/mocks/product.mock';

export const mockAddProduct = (): AddProduct => {
  class AddProductStub implements AddProduct {
    async add(data: AddProduct.Params): Promise<AddProduct.Result> {
      return Promise.resolve(mockAddProductModel());
    }
  }
  return new AddProductStub();
};
