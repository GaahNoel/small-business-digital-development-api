import { GetBusinessCitiesAndStates } from '@/domain/usecases/business/get-business-cities-and-states';
import { NotFound } from '@/presentation/errors';
import { badRequest, internalServerError, success } from '@/presentation/helpers/http.helpers';
import { BaseController, HttpResponse } from '@/presentation/protocols';

namespace GetBusinessCitiesAndStatesController {
  export type Params = {};
  export type Result = HttpResponse;
}

export class GetBusinessCitiesAndStatesController implements BaseController {
  constructor(private readonly getBusinessCitiesAndStates: GetBusinessCitiesAndStates) {}

  async handle(): Promise<GetBusinessCitiesAndStatesController.Result> {
    try {
      const result = await this.getBusinessCitiesAndStates.getCitiesAndStates({});

      if (result.length <= 0) {
        throw new NotFound({
          entity: 'Business',
          message: 'No business found on Db',
        });
      }

      return success(result);
    } catch (error) {
      if (error instanceof NotFound) {
        return badRequest(error);
      }
      return internalServerError(error);
    }
  }
}
