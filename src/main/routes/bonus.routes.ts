import { Router } from 'express';
import { adaptRoute } from '../adapters/express/express-route.adapter';
import { makeBuyBonusController } from '../factories/controller/bonus/buy-bonus-controller.factory';
import { makeListBonusController } from '../factories/controller/bonus/list-bonus-controller.factory';

export default (router: Router): void => {
  router.get('/bonus/list', adaptRoute(makeListBonusController()));
  router.post('/bonus/buy', adaptRoute(makeBuyBonusController()));
};
