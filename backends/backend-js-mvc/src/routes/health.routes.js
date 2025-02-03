const { Router } = require('express');
const { HealthController } = require('../controllers/health.controller');

const router = Router();
const controller = new HealthController();

const routes = {
  get: '/',
  post: '/'
};

router.get(routes.get, controller.check.bind(controller));
router.post(routes.post, controller.checkPost.bind(controller));

module.exports = { healthRoutes: router };