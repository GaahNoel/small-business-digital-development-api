import { Request, Response, NextFunction } from 'express';

export const contentType = (req: Request, res: Response, next: NextFunction): void => {
  // res.type já seta o content type
  res.type('json');

  next();
};
