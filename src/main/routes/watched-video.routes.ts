import { Router } from 'express';
import { adaptRoute } from '../adapters/express/express-route.adapter';
import { makeCreateWatchedVideoController } from '../factories/controller/watched-video';
import { auth } from '../middlewares/auth';

export default (router: Router): void => {
  router.post('/watched-video/create', auth(), adaptRoute(makeCreateWatchedVideoController()));
};
