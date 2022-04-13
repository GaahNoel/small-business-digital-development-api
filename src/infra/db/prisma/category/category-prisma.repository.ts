import { AddCategoryRepository } from '@/data/protocols/db/category';
import { prisma } from '@/infra/db/helpers';

export class CategoryPrismaRepository implements AddCategoryRepository {
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
}
