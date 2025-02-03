import { Router } from 'express';
import { HealthRoutes } from './health.routes';

export class Routes {
  private router: Router;

  constructor() {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // Health check routes
    const healthRoutes = new HealthRoutes();
    this.router.use('/', healthRoutes.getRoutes());

    // Aquí puedes agregar más rutas modularmente
    // this.router.use('/users', userRoutes.getRoutes());
  }

  getRoutes(): Router {
    return this.router;
  }
}