import { GetAllAccountIds } from '@/domain/usecases/account/get-all-acount-ids';
import { NotFound } from '@/presentation/errors';
import { internalServerError, notFound, success } from '@/presentation/helpers/http.helpers';
import { BaseController, HttpResponse } from '@/presentation/protocols';

namespace GetAllAccountIdsController {
  export type Params = {};
  export type Result = HttpResponse;
}

export class GetAllAccountIdsController implements BaseController {
  constructor(private readonly getAllAccountIds: GetAllAccountIds) {}

  async handle(): Promise<GetAllAccountIdsController.Result> {
    const result = await this.getAllAccountIds.getAllAccountIds();

    return success(result);
  }
}
