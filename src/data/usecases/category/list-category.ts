import { ListCategoryRepository } from '@/data/protocols/db/category/list-category.repository';
import { ListCategory } from '@/domain/usecases/category/list-category';

export class ListCategoryUseCase implements ListCategory {
  constructor(private readonly listCategoryRepository: ListCategoryRepository) {}

  async list(): Promise<ListCategory.Result> {
    const result = await this.listCategoryRepository.list();

    return result.map((category) => ({
      id: category.id,
      name: category.name,
    }));
  }
}
