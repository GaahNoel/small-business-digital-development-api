import { ListBusiness } from '@/domain/usecases/business';
import { MissingParamsError } from '@/presentation/errors';
import { badRequest, internalServerError, success } from '@/presentation/helpers/http.helpers';
import { BaseController, HttpResponse } from '@/presentation/protocols';

namespace ListBusinessController {
  export type Params = {
    location?: {
      latitude: number;
      longitude: number;
      radius: number;
    },
    city?: {
      name: string;
      state: string;
    }
  };

  export type Result = HttpResponse;
}

export class ListBusinessController implements BaseController {
  constructor(private readonly listBusiness: ListBusiness) {}

  async handle(data: ListBusinessController.Params): Promise<ListBusinessController.Result> {
    try {
      this.validate(data);

      const result = await this.listBusiness.list({
        location: data.location,
        city: data.city,
      });

      return success(result);
    } catch (error) {
      if (error instanceof MissingParamsError) {
        return badRequest(error);
      }

      return internalServerError(error);
    }
  }

  private validate(data: ListBusinessController.Params): void {
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

    if (invalidParams.length > 0) {
      throw new MissingParamsError({
        params: invalidParams,
      });
    }
  }
}
