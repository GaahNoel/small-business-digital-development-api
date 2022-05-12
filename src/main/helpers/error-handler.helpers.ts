import { HttpResponse } from '@/presentation/protocols';
import { internalServerError } from '@/presentation/helpers/http.helpers';
import { ErrorHandler } from '@/presentation/protocols/error-handler';
import { Logger } from '@/presentation/protocols/logger';

export class ControllerErrorHandler implements ErrorHandler {
  constructor(private readonly logger: Logger) {}

  handle(error: Error): HttpResponse {
    this.logger.error(error.message, error);
    return internalServerError(error);
  }
}
