import { Router } from 'express';
import { adaptRoute } from '@/main/adapters/express/express-route.adapter';
import { makeSignUpController } from '@/main/factories/controller/account/signup-controller.factory';
import { makeVerifyAccountController } from '../factories/controller/account/verifyAccount-controller.factory';

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()));
  router.put('/account/verify', adaptRoute(makeVerifyAccountController()));
};
