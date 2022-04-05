import { mockAddCategoryModel } from '@/tests/domain/mocks/category.mock';
import { AddCategoryRepository } from '../protocols/db/category/addCategory.repository';

export const mockAddCategoryRepository = (): AddCategoryRepository => {
  class AddCategoryRepositoryStub implements AddCategoryRepository {
    async add(data: AddCategoryRepository.Params): Promise<AddCategoryRepository.Result> {
      const mockedCategoryModel = mockAddCategoryModel();
      return Promise.resolve({
        id: mockedCategoryModel.id,
      });
    }
  }

  return new AddCategoryRepositoryStub();
};
