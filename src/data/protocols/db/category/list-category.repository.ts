import { CategoryModel } from '@/domain/models/category';
import { ListCategory } from '@/domain/usecases/category';

export interface ListCategoryRepository {
  list(): Promise<ListCategoryRepository.Result>;
}

export namespace ListCategoryRepository {
  export type Params = ListCategory.Params;
  export type Result = CategoryModel[];
}
