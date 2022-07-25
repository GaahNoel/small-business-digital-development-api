import { Router } from 'express';
import { adaptRoute } from '../adapters/express/express-route.adapter';
import { makeCreateChallengeController } from '../factories/controller/challenge/create-challenge-controller.factory';
import { makeRenewAccountChallengesController } from '../factories/controller/challenge/renew-account-challenges-controller.factory';

export default (router: Router): void => {
  router.post('/challenge/create', adaptRoute(makeCreateChallengeController()));
  router.post('/challenge/renew/:accountId', adaptRoute(makeRenewAccountChallengesController()));
};
