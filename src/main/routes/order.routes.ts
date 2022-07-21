import { Router } from 'express';
import { adaptRoute } from '../adapters/express/express-route.adapter';
import { makeChangeOrderStatusControllerFactory } from '../factories/controller/order/change-order-status-controller.factory';
import { makeCreateOrderController } from '../factories/controller/order/create-order-controller.factory';
import { makeGetOrderByIdController } from '../factories/controller/order/get-order-by-id-controller.factory';
import { makeListAccountOrders } from '../factories/controller/order/list-account-orders-controller.factory';
import { auth } from '../middlewares/auth';

export default (router: Router): void => {
  router.post('/order/create', auth(), adaptRoute(makeCreateOrderController()));
  router.put('/order/edit/status/:orderId', auth(), adaptRoute(makeChangeOrderStatusControllerFactory()));
  router.get('/order/account/:accountId', auth(), adaptRoute(makeListAccountOrders()));
  router.get('/order/:orderId', auth(), adaptRoute(makeGetOrderByIdController()));
};
