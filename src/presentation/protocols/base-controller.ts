import { HttpRequest, HttpResponse } from './http';

export interface BaseController<T = any> {
  handle(data: T): Promise<HttpResponse>;
}
