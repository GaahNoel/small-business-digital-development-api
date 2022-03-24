import { NextFunction, Request, Response } from 'express';
import { Middleware } from '@/presentation/protocols';

export const adaptMiddleware = (middleware: Middleware) => async (
  req: Request,
  res: Response, next: NextFunction,
) => {
  const httpRequest = {
    ...(req.headers || {}),
  };

  const successStatusCodes = [200, 204];

  const httpResponse = await middleware.handle(httpRequest);

  if (!successStatusCodes.includes(httpResponse.statusCode)) {
    return res.status(httpResponse.statusCode).json({
      error: httpResponse.body.message,
    });
  }

  Object.assign(req, httpResponse.body);

  return next();
};
