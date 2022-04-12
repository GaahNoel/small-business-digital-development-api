import { Router } from 'express';
import { adaptRoute } from '../adapters/express/express-route.adapter';
import { makeAddCategoryController } from '../factories/controller/category';

export default (router: Router): void => {
  router.post('/category/create', adaptRoute(makeAddCategoryController()));
};
