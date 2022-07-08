import { ListBusiness } from '@/domain/usecases/business';
import { ListProductsByBusinesses } from '@/domain/usecases/product';
import { MissingParamsError, NotFound } from '@/presentation/errors';
import {
  badRequest, internalServerError, notFound, success,
} from '@/presentation/helpers/http.helpers';
import { BaseController, HttpResponse } from '@/presentation/protocols';

namespace ListProductsByBusinessesController {
  export type Params = {
    type: 'product' | 'service';
    location?: {
      latitude: number;
      longitude: number;
      radius: number;
    }
    city?: {
      name: string;
      state: string;
    }
  };
  export type Result = HttpResponse;
}

export class ListProductsByBusinessesController implements BaseController {
  constructor(private readonly listBusiness: ListBusiness, private readonly listProductsByBusinesses: ListProductsByBusinesses) {}

  async handle(data: ListProductsByBusinessesController.Params): Promise<ListProductsByBusinessesController.Result> {
    try {
      this.validate(data);
      const businesses = await this.listBusiness.list({
        location: data.location,
        city: data.city,
      });

      if (businesses.length <= 0) {
        throw new NotFound({
          entity: 'Business',
        });
      }
      const mappedBusinessesIds = businesses.map((business) => business.id);

      const products = await this.listProductsByBusinesses.listProductsByBusinesses({
        businessesIds: mappedBusinessesIds,
        type: data.type.toLocaleLowerCase() as 'product' | 'service',
        location: data.location,
      });

      return success(products);
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

  private validate(data: ListProductsByBusinessesController.Params): void {
    const invalidParams = [];

    if (data.location) {
      if (data.location.latitude === undefined) {
        invalidParams.push('location.latitude');
      }
      if (data.location.longitude === undefined) {
        invalidParams.push('location.longitude');
      }
      if (data.location.radius === undefined) {
        invalidParams.push('location.radius');
      }
    }

    if (data.city) {
      if (!data.city.name) {
        invalidParams.push('city.name');
      }
      if (!data.city.state) {
        invalidParams.push('city.state');
      }
    }

    if (!data.type) {
      invalidParams.push('type');
    }

    if (invalidParams.length > 0) {
      throw new MissingParamsError({
        params: invalidParams,
      });
    }
  }
}
