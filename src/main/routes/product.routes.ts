import { Router } from 'express';
import { adaptRoute } from '../adapters/express/express-route.adapter';
import { makeAddProductController } from '../factories/controller/product';
import { makeListProductFromBusinessController } from '../factories/controller/product/list-product-from-business.factory';
import { auth } from '@/main/middlewares/auth';
import { makeDeleteProductController } from '../factories/controller/product/delete-product-controller.factory';
import { makeEditProductController } from '../factories/controller/product/edit-product-controller.factory';

export default (router: Router): void => {
  router.post('/product/create', auth(), adaptRoute(makeAddProductController()));
  router.get('/product/list/:businessId', adaptRoute(makeListProductFromBusinessController()));
  router.delete('/product/delete/:productId', auth(), adaptRoute(makeDeleteProductController()));
  router.put('/product/edit/:productId', auth(), adaptRoute(makeEditProductController()));
};
