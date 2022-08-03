import { Router } from 'express';
import { adaptRoute } from '../adapters/express/express-route.adapter';
import { makeCreateChallengeController } from '../factories/controller/challenge/create-challenge-controller.factory';
import { makeGetAccountChallengesController } from '../factories/controller/challenge/get-account-challenges-controller.factory';
import { makeRenewAccountChallengesController } from '../factories/controller/challenge/renew-account-challenges-controller.factory';
import { auth } from '../middlewares/auth';

export default (router: Router): void => {
  router.post('/challenge/create', adaptRoute(makeCreateChallengeController()));
  router.get('/challenge/renew/:accountId', adaptRoute(makeRenewAccountChallengesController()));
  router.get('/challenge/:accountId', auth(), adaptRoute(makeGetAccountChallengesController()));
};
