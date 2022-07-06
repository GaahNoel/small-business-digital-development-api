import { HttpResponse } from '@/presentation/protocols/http';
import { NotFound } from '../errors';
import { InternalServerError } from '../errors/internal-server.error';

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error,
});

export const success = <T>(data: T): HttpResponse => ({
  statusCode: 200,
  body: data,
});

export const internalServerError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new InternalServerError(error.stack),
});

export const notFound = (error: Error): HttpResponse => ({
  statusCode: 404,
  body: error,
});

export const forbidden = (error: Error): HttpResponse => ({
  statusCode: 403,
  body: error,
});
