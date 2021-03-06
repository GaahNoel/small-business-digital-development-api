import { Router } from 'express';
import { adaptRoute } from '@/main/adapters/express/express-route.adapter';
import { makeSignUpController, makeVerifyAccountController } from '@/main/factories/controller/account';
import { makeCheckAccountPasswordController } from '@/main/factories/controller/account/check-account-password-controller.factory';
import { makeEditAccountController } from '../factories/controller/account/edit-account-controller.factory';
import { makeGetAccountByEmailController } from '../factories/controller/account/get-account-by-email-controller.factory';
import { auth } from '@/main/middlewares/auth';
import { makeGetAccountByIdController } from '../factories/controller/account/get-account-by-id-controller.factory';
import { makeGetAllAccountIdsController } from '../factories/controller/account/get-all-account-ids-controller.factory';

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()));
  router.put('/account/verify', adaptRoute(makeVerifyAccountController()));
  router.post('/account/check-password', adaptRoute(makeCheckAccountPasswordController()));
  router.put('/account/edit/:id', auth(), adaptRoute(makeEditAccountController()));
  router.get('/account/email', adaptRoute(makeGetAccountByEmailController()));
  router.get('/account/all', adaptRoute(makeGetAllAccountIdsController()));
  router.get('/account/:accountId', auth(), adaptRoute(makeGetAccountByIdController()));
};
