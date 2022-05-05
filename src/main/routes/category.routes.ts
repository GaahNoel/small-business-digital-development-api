import { Router } from 'express';
import { adaptRoute } from '@/main/adapters/express/express-route.adapter';
import { makeAddCategoryController } from '@/main/factories/controller/category';
import { makeListCategoryController } from '../factories/controller/category/list-category-controller.factory';

export default (router: Router): void => {
  router.post('/category/create', adaptRoute(makeAddCategoryController()));
  router.get('/category/list', adaptRoute(makeListCategoryController()));
};
