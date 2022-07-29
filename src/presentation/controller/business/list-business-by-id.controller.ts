import { ListBusinessById } from '@/domain/usecases/business/list-business-by-id';
import { MissingParamsError, NotFound } from '@/presentation/errors';
import {
  badRequest, internalServerError, notFound, success,
} from '@/presentation/helpers/http.helpers';
import { BaseController, HttpResponse } from '@/presentation/protocols';

namespace ListBusinessByIdController {
  export type Params = {
    businessId: string;
  };
  export type Result = HttpResponse;
}

export class ListBusinessByIdController implements BaseController {
  constructor(private readonly listBusinessById: ListBusinessById) {}

  async handle(data: ListBusinessByIdController.Params): Promise<ListBusinessByIdController.Result> {
    try {
      this.validate(data);

      const result = await this.listBusinessById.list({
        businessId: data.businessId,
      });

      return success({
        id: result.id,
        name: result.name,
        description: result.description,
        accountId: result.accountId,
        imageUrl: result.imageUrl,
        latitude: result.latitude,
        longitude: result.longitude,
        street: result.street,
        city: result.city,
        state: result.state,
        zip: result.zip,
        country: result.country,
        maxPermittedCouponPercentage: result.maxPermittedCouponPercentage,
      });
    } catch (error) {
      if (error instanceof MissingParamsError) {
        return badRequest(error);
      }

      if (error instanceof NotFound) {
        return notFound(error);
      }

      return internalServerError(error);
    }
  }

  private validate(data:ListBusinessByIdController.Params) {
    if (!data.businessId) {
      throw new MissingParamsError({
        params: ['businessId'],
      });
    }
  }
}
