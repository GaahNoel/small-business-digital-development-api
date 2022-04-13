import { CategoryModel } from '../models/category';
import { AddCategory } from '../usecases/category/add-category';

export const mockAddCategoryParams = (): AddCategory.Params => ({
  name: 'any_name',
  description: 'any_description',
});

export const mockAddCategoryModel = (): CategoryModel => ({
  id: 'any_id',
  description: 'any_description',
  ...mockAddCategoryParams(),
});
