/* eslint-disable import/order */
import { bodyParser, contentType } from '@/main/middlewares';
import cors from 'cors';

import { Express } from 'express';

export const setupMiddlewares = (app: Express): void => {
  app.use(bodyParser);
  app.use(cors());
  app.use(contentType);
};
