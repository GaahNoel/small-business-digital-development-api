import { Router } from 'express';
import { adaptRoute } from '@/main/adapters/express/express-route.adapter';
import { makeSignUpController } from '@/main/factories/controller/account/signup-controller.factory';

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()));
};
