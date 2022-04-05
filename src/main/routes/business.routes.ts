import { Router } from 'express';
import { adaptRoute } from '../adapters/express/express-route.adapter';
import { makeAddBusinessController } from '../factories/controller/business/addBusiness-controller.factory';

export default (router: Router): void => {
  router.post('/business/create', adaptRoute(makeAddBusinessController()));
};
