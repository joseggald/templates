import { Application, Router } from 'express';
import { healthRoutes } from './health.routes';
import { ResponseHandler } from '../utils/responses';
const { sendError } = ResponseHandler;
// Importa aquí otras rutas cuando las agregues

export const initializeRoutes = (app: Application): void => {
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