import { MissingParamsError, NotFound } from '../errors';
import { InvalidParamsError } from '../errors/invalid-params.error';
import { badRequest, internalServerError, notFound } from '../helpers/http.helpers';
import { BaseController, HttpResponse } from '../protocols';

export class ErrorHandlerDecorator implements BaseController {
  constructor(private readonly controller: BaseController) {}

  async handle(data: any): Promise<HttpResponse> {
    try {
      const controllerResponse = await this.controller.handle(data);
      return controllerResponse;
    } catch (error) {
      if (error instanceof NotFound) {
        return notFound(error);
      }

      if (error instanceof MissingParamsError || error instanceof InvalidParamsError) {
        return badRequest(error);
      }

      return internalServerError(error);
    }
  }
}
