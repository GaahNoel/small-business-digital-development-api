import { ListBonus } from '@/domain/usecases/bonus';
import { NotFound } from '@/presentation/errors';
import { internalServerError, notFound, success } from '@/presentation/helpers/http.helpers';
import { BaseController, HttpResponse } from '@/presentation/protocols';

namespace ListBonusController {
  export type Params = ListBonus.Params;
  export type Result = HttpResponse;
}
export class ListBonusController implements BaseController {
  constructor(private readonly listBonus: ListBonus) {}

  async handle(data: ListBonusController.Params): Promise<ListBonusController.Result> {
    try {
      const result = await this.listBonus.listBonus({
        type: data.type,
      });

      return success(result);
    } catch (error) {
      if (error instanceof NotFound) {
        return notFound(error);
      }

      return internalServerError(error);
    }
  }
}
