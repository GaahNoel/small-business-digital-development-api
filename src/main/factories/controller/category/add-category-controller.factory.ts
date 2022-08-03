import { DbAddCategory } from '@/data/usecases/category';
import { CategoryPrismaRepository } from '@/infra/db/prisma/category';
import { AddCategoryController } from '@/presentation/controller/category/add-category.controller';
import { ErrorHandlerDecorator } from '@/presentation/decorators';
import { BaseController } from '@/presentation/protocols';

export const makeAddCategoryController = (): BaseController => {
  const addCategoryRepository = new CategoryPrismaRepository();

  const dbAddCategory = new DbAddCategory(addCategoryRepository);

  return new ErrorHandlerDecorator(new AddCategoryController(dbAddCategory));
};
