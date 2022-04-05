import { AddBusiness } from '@/domain/usecases/business';
import { internalServerError, success } from '@/presentation/helpers/http.helpers';
import { BaseController, HttpResponse } from '@/presentation/protocols';

namespace AddBusinessController {
  export type Request = {
    name: string;
    description: string;
    imageUrl: string;
    accountId: string;
  };
}

export class AddBusinessController implements BaseController {
  constructor(
    private readonly addBusiness: AddBusiness,
  ) {}

  async handle(data: AddBusinessController.Request): Promise<HttpResponse> {
    try {
      const {
        name, description, imageUrl, accountId,
      } = data;

      const result = await this.addBusiness.add({
        name,
        description,
        imageUrl,
        accountId,
      });

      return success({ id: result.id });
    } catch (error) {
      return internalServerError(error);
    }
  }
}
