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
      const result = await this.addBusiness.add(data);

      return success({ id: result.id });
    } catch (error) {
      return internalServerError(error);
    }
  }
}
