import { AddCategory } from '@/domain/usecases/category/add-category';
import { mockAddCategoryModel } from '@/tests/domain/mocks/category.mock';

export const mockAddCategory = (): AddCategory => {
  class AddCategoryStub implements AddCategory {
    async add(data: AddCategory.Params): Promise<AddCategory.Result> {
      return Promise.resolve(mockAddCategoryModel());
    }
  }
  return new AddCategoryStub();
};
