import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { setupMiddlewares } from './middlewares';
import { setupRoutes } from './routes';
import swaggerFile from '@/swagger.json';

const app = express();
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

setupMiddlewares(app);
setupRoutes(app);

export { app };
