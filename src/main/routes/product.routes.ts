import { Router } from 'express';
import { adaptRoute } from '../adapters/express/express-route.adapter';
import { makeAddProductController } from '../factories/controller/product';

export default (router: Router): void => {
  router.post('/product/create', adaptRoute(makeAddProductController()));
};
