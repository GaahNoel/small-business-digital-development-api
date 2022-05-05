import { mockCategoryModel } from '@/tests/domain/mocks/category.mock';
import { AddCategoryRepository } from '../protocols/db/category/add-category.repository';

export const mockAddCategoryRepository = (): AddCategoryRepository => {
  class AddCategoryRepositoryStub implements AddCategoryRepository {
    async add(data: AddCategoryRepository.Params): Promise<AddCategoryRepository.Result> {
      const mockedCategoryModel = mockCategoryModel();
      return Promise.resolve({
        id: mockedCategoryModel.id,
      });
    }
  }

  return new AddCategoryRepositoryStub();
};
