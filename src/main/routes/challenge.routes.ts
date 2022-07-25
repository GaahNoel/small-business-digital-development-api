import { Router } from 'express';
import { adaptRoute } from '../adapters/express/express-route.adapter';
import { makeCreateChallengeController } from '../factories/controller/challenge/create-challenge-controller.factory';

export default (router: Router): void => {
  router.post('/challenge/create', adaptRoute(makeCreateChallengeController()));
};
