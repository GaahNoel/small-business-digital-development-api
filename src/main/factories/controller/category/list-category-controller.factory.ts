import { ListCategoryUseCase } from '@/data/usecases/category/list-category';
import { CategoryPrismaRepository } from '@/infra/db/prisma/category';
import { ListCategoryController } from '@/presentation/controller/category';
import { ErrorHandlerDecorator } from '@/presentation/decorators';
import { BaseController } from '@/presentation/protocols';

export const makeListCategoryController = (): BaseController => {
  const listCategoryRepository = new CategoryPrismaRepository();

  const listCategoryUseCase = new ListCategoryUseCase(listCategoryRepository);

  return new ErrorHandlerDecorator(new ListCategoryController(listCategoryUseCase));
};
