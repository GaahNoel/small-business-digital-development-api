import { mockAddProductModel } from '@/tests/domain/mocks/product.mock';
import { AddProductRepository } from '@/data/protocols/db/product';

export const mockAddProductRepository = (): AddProductRepository => {
  class AddProductRepositoryStub implements AddProductRepository {
    async add(data: AddProductRepository.Params): Promise<AddProductRepository.Result> {
      const mockedProductModel = mockAddProductModel();
      return Promise.resolve({
        productId: mockedProductModel.id,
      });
    }
  }

  return new AddProductRepositoryStub();
};
