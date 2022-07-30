import { Router } from 'express';
import { adaptRoute } from '../adapters/express/express-route.adapter';
import { makeListBonusController } from '../factories/controller/bonus/list-bonus-controller.factory';

export default (router: Router): void => {
  router.get('/bonus/list', adaptRoute(makeListBonusController()));
};
