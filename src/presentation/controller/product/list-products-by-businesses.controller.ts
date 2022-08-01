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
    latitude?: number;
    longitude?: number;
    radius?: number;
    city?: string;
    state?: string;
  };
  export type Result = HttpResponse;
}

export class ListProductsByBusinessesController implements BaseController {
  constructor(private readonly listBusiness: ListBusiness, private readonly listProductsByBusinesses: ListProductsByBusinesses) {}

  async handle(data: ListProductsByBusinessesController.Params): Promise<ListProductsByBusinessesController.Result> {
    this.validate(data);
    const businesses = await this.listBusiness.list({
      location: {
        latitude: data.latitude,
        longitude: data.longitude,
        radius: data.radius,
      },
      city: {
        name: data.city,
        state: data.state,
      },
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
      location: {
        latitude: data.latitude,
        longitude: data.longitude,
        radius: data.radius,
      },
    });

    return success(products);
  }

  private validate(data: ListProductsByBusinessesController.Params): void {
    const invalidParams = [];

    if (data.latitude || data.longitude || data.radius) {
      if (data.latitude === undefined) {
        invalidParams.push('latitude');
      }
      if (data.longitude === undefined) {
        invalidParams.push('longitude');
      }
      if (data.radius === undefined) {
        invalidParams.push('radius');
      }
    }

    if (data.city || data.state) {
      if (!data.city) {
        invalidParams.push('city');
      }
      if (!data.state) {
        invalidParams.push('state');
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
