import { Express, Router } from 'express';
import { readdirSync } from 'fs';

export const setupRoutes = (app: Express) => {
  const router = Router();
  app.use('/api', router);
  const files = readdirSync(`${__dirname}/../routes`);

  files.forEach(async (file) => {
    if (!file.includes('.test.') && !file.endsWith('.map')) {
      const route = (await import(`../routes/${file}`)).default;
      route(router);
    }
  });
};
