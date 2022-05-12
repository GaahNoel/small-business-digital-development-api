import { HttpResponse } from './http';

export interface ErrorHandler {
  handle(error: Error): HttpResponse;
}
