import { Request, Response } from 'express';
import { BaseController, HttpRequest } from '@/presentation/protocols';

export const adaptRoute = (controller: BaseController) => async (req: Request, res: Response) => {
  const httpRequest: HttpRequest = {
    body: req.body,
  };

  const successStatus = [200];
  const httpResponse = await controller.handle(httpRequest);

  if (!successStatus.includes(httpResponse.statusCode)) {
    return res.status(httpResponse.statusCode).json({
      error: httpResponse.body.message,
    });
  }

  return res.status(httpResponse.statusCode).json(httpResponse.body);
};
