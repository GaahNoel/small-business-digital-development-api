import { AddCategory } from '@/domain/usecases/category/add-category';
import { internalServerError, success } from '@/presentation/helpers/http.helpers';
import { BaseController, HttpResponse } from '@/presentation/protocols';

namespace AddCategoryController {
  export type Request = {
    name: string;
    description: string;
  };
}

export class AddCategoryController implements BaseController {
  constructor(
    private readonly addCategory: AddCategory,
  ) {}

  async handle(data: AddCategoryController.Request): Promise<HttpResponse> {
    try {
      const {
        name, description,
      } = data;

      const result = await this.addCategory.add({
        name,
        description,
      });

      return success({ id: result.id });
    } catch (error) {
      return internalServerError(error);
    }
  }
}
