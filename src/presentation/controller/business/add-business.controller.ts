import { AddBusiness } from '@/domain/usecases/business';
import { internalServerError, success } from '@/presentation/helpers/http.helpers';
import { BaseController, HttpResponse } from '@/presentation/protocols';

namespace AddBusinessController {
  export type Request = {
    name: string;
    description: string;
    imageUrl: string;
    accountId: string;
    city: string;
    country: string;
    latitude: string;
    longitude: string;
    state: string;
    street: string;
    zip: string;
  };
}

export class AddBusinessController implements BaseController {
  constructor(
    private readonly addBusiness: AddBusiness,
  ) {}

  async handle(data: AddBusinessController.Request): Promise<HttpResponse> {
    try {
      const result = await this.addBusiness.add({
        name: data.name,
        description: data.description,
        imageUrl: data.imageUrl,
        accountId: data.accountId,
        city: data.city,
        country: data.country,
        latitude: data.latitude,
        longitude: data.longitude,
        state: data.state,
        street: data.street,
        zip: data.zip,
      });

      return success({ id: result.id });
    } catch (error) {
      return internalServerError(error);
    }
  }
}
