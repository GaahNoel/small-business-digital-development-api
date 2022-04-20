import { Router } from 'express';
import { adaptRoute } from '@/main/adapters/express/express-route.adapter';
import { makeSignUpController, makeVerifyAccountController } from '@/main/factories/controller/account';
import { makeCheckAccountPasswordController } from '@/main/factories/controller/account/check-account-password-controller.factory';
import { makeEditAccountController } from '../factories/controller/account/edit-account-controller.factory';

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()));
  router.put('/account/verify', adaptRoute(makeVerifyAccountController()));
  router.post('/account/check-password', adaptRoute(makeCheckAccountPasswordController()));
  router.put('/account/edit/:id', adaptRoute(makeEditAccountController()));
};
