const { Router } = require('express');
const { healthRoutes } = require('./health.routes');
const { ResponseHandler } = require('../utils/responses');
const { sendError } = ResponseHandler;

const initializeRoutes = (app) => {
  const apiRouter = Router();

  // Rutas de API
  apiRouter.use('/', healthRoutes);
  // Agrega aquí otras rutas cuando las crees

  // Prefijo global para todas las rutas de API
  app.use('', apiRouter);

  // Manejador de rutas no encontradas
  app.use('*', (req, res) => {
    sendError(res, `Route ${req.originalUrl} not found`, 404);
  });
};
module.exports = { initializeRoutes };