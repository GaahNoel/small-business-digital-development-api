import { Router } from 'express';
import { adaptRoute } from '../adapters/express/express-route.adapter';
import { makeAddBusinessController, makeListBusinessFromAccountController } from '../factories/controller/business';

export default (router: Router): void => {
  router.post('/business/create', adaptRoute(makeAddBusinessController()));
  router.get('/business/list/:accountId', adaptRoute(makeListBusinessFromAccountController()));
};
