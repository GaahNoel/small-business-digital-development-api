import { Router } from 'express';
import { adaptRoute } from '../adapters/express/express-route.adapter';
import { makeChangeOrderStatusControllerFactory } from '../factories/controller/order/change-order-status-controller.factory';
import { makeCreateOrderController } from '../factories/controller/order/create-order-controller.factory';
import { auth } from '../middlewares/auth';

export default (router: Router): void => {
  router.post('/order/create', auth(), adaptRoute(makeCreateOrderController()));
  router.put('/order/:orderId', auth(), adaptRoute(makeChangeOrderStatusControllerFactory()));
};
