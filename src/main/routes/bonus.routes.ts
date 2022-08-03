import { Router } from 'express';
import { adaptRoute } from '../adapters/express/express-route.adapter';
import { makeGetAccountBonusesController, makeBuyBonusController, makeListBonusController } from '../factories/controller/bonus';
import { auth } from '../middlewares/auth';

export default (router: Router): void => {
  router.get('/bonus/list', adaptRoute(makeListBonusController()));
  router.get('/bonus/:accountId', auth(), adaptRoute(makeGetAccountBonusesController()));
  router.post('/bonus/buy', auth(), adaptRoute(makeBuyBonusController()));
};
