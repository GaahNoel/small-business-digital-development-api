import { DbAddCategory } from '@/data/usecases/category';
import { CategoryPrismaRepository } from '@/infra/db/prisma/category';
import { AddCategoryController } from '@/presentation/controller/category/add-category.controller';
import { BaseController } from '@/presentation/protocols';

export const makeAddCategoryController = (): BaseController => {
  const addCategoryRepository = new CategoryPrismaRepository();

  const dbAddCategory = new DbAddCategory(addCategoryRepository);

  return new AddCategoryController(dbAddCategory);
};
