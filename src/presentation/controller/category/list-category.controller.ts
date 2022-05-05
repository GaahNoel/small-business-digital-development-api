import { ListCategory } from '@/domain/usecases/category';
import { internalServerError, success } from '@/presentation/helpers/http.helpers';
import { BaseController, HttpResponse } from '@/presentation/protocols';

export class ListCategoryController implements BaseController {
  constructor(private readonly listCategory: ListCategory) {}

  async handle(): Promise<HttpResponse> {
    try {
      const result = await this.listCategory.list();

      return success(result);
    } catch (error) {
      return internalServerError(error);
    }
  }
}
