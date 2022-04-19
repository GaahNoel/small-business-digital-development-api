import { Router } from 'express';
import { adaptRoute } from '@/main/adapters/express/express-route.adapter';
import { makeAddCategoryController } from '@/main/factories/controller/category';

export default (router: Router): void => {
  router.post('/category/create', adaptRoute(makeAddCategoryController()));
};
