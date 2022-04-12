import { Router } from 'express';
import { adaptRoute } from '../adapters/express/express-route.adapter';
import { makeAddProductController } from '../factories/controller/product';
import { makeListProductFromBusinessController } from '../factories/controller/product/list-product-from-business.factory';

export default (router: Router): void => {
  router.post('/product/create', adaptRoute(makeAddProductController()));
  router.get('/product/list/businessId', adaptRoute(makeListProductFromBusinessController()));
};
