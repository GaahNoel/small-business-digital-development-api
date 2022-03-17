import { HttpRequest, HttpResponse } from './http';

export interface BaseController {
  handle(data: HttpRequest): Promise<HttpResponse>;
}
