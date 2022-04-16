import { Router } from 'express';
import { adaptRoute } from '../adapters/express/express-route.adapter';
import { makeAddBusinessController, makeListBusinessFromAccountController } from '../factories/controller/business';
import { auth } from '@/main/middlewares/auth';

export default (router: Router): void => {
  router.post('/business/create', auth(), adaptRoute(makeAddBusinessController()));
  router.get('/business/list/:accountId', auth(), adaptRoute(makeListBusinessFromAccountController()));
};
