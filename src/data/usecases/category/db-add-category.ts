import { AddCategoryRepository } from '@/data/protocols/db/category';
import { AddCategory } from '@/domain/usecases/category/add-category';

export class DbAddCategory implements AddCategory {
  constructor(private readonly addCategoryRepository: AddCategoryRepository) {}

  async add(params : AddCategory.Params): Promise<AddCategory.Result> {
    const category = await this.addCategoryRepository.add(params);
    return {
      id: category.id,
    };
  }
}
