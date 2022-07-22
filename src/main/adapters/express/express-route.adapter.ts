import { Request, Response } from 'express';
import { BaseController } from '@/presentation/protocols';

export const adaptRoute = (controller: BaseController) => async (req: Request, res: Response) => {
  const httpRequest = {
    ...(req.body || {}),
    ...(req.params || {}),
    ...(req.query || {}),
  };

  if (req.accountId) {
    httpRequest.authAccountId = req.accountId;
  }

  const successStatus = [200];
  const httpResponse = await controller.handle(httpRequest);

  if (!successStatus.includes(httpResponse.statusCode)) {
    return res.status(httpResponse.statusCode).json({
      error: httpResponse.body.message,
    });
  }

  return res.status(httpResponse.statusCode).json(httpResponse.body);
};
