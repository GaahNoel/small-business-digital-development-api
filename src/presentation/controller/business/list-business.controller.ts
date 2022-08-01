import { ListBusiness } from '@/domain/usecases/business';
import { MissingParamsError } from '@/presentation/errors';
import { badRequest, internalServerError, success } from '@/presentation/helpers/http.helpers';
import { BaseController, HttpResponse } from '@/presentation/protocols';

namespace ListBusinessController {
  export type Params = {
    latitude?: number;
    longitude?: number;
    radius?: number;
    city?: string;
    state?: string;
  };

  export type Result = HttpResponse;
}

export class ListBusinessController implements BaseController {
  constructor(private readonly listBusiness: ListBusiness) {}

  async handle(data: ListBusinessController.Params): Promise<ListBusinessController.Result> {
    this.validate(data);

    const result = await this.listBusiness.list({
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

    return success(result);
  }

  private validate(data: ListBusinessController.Params): void {
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

    if (invalidParams.length > 0) {
      throw new MissingParamsError({
        params: invalidParams,
      });
    }
  }
}
