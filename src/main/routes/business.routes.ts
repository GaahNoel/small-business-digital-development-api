import { Router } from 'express';
import { adaptRoute } from '@/main/adapters/express/express-route.adapter';
import { makeAddBusinessController, makeListBusinessFromAccountController } from '../factories/controller/business';
import { auth } from '@/main/middlewares/auth';
import { makeDeleteBusinessController } from '../factories/controller/business/delete-business-controller.factory';

export default (router: Router): void => {
  router.post('/business/create', auth(), adaptRoute(makeAddBusinessController()));
  router.get('/business/list/:accountId', adaptRoute(makeListBusinessFromAccountController()));
  router.delete('/business/delete/:businessId', auth(), adaptRoute(makeDeleteBusinessController()));
};
