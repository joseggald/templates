import { Router } from 'express';
import { HealthController } from '../controllers/health.controller';

const router = Router();
const controller = new HealthController();

const routes = {
  get: '/',
  post: '/'
};

router.get(routes.get, controller.check.bind(controller));
router.post(routes.post, controller.checkPost.bind(controller));


export { router as healthRoutes };