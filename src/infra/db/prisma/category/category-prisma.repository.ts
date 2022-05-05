import { AddCategoryRepository } from '@/data/protocols/db/category';
import { ListCategoryRepository } from '@/data/protocols/db/category/list-category.repository';
import { prisma } from '@/infra/db/helpers';

export class CategoryPrismaRepository implements AddCategoryRepository, ListCategoryRepository {
  async add(data: AddCategoryRepository.Params): Promise<AddCategoryRepository.Result> {
    const {
      description, name,
    } = data;
    const category = await prisma.category.create({
      data: {
        description,
        name,
      },
    });
    return category;
  }

  async list(): Promise<ListCategoryRepository.Result> {
    const categories = await prisma.category.findMany({});

    return categories;
  }
}
