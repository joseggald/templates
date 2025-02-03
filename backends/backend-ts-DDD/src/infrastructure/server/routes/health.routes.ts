import { Router } from 'express';
import { HealthController } from '../controllers/health.controller';
import { AuthService } from '../../../application/services/AuthService';
import { authMiddleware } from '../../middleware/auth.middleware';

export class HealthRoutes {
  private router: Router;
  private controller: HealthController;
  private authService: AuthService;

  constructor() {
    this.router = Router();
    this.authService = new AuthService();
    this.controller = new HealthController(this.authService);
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.get('/', this.controller.healthCheck.bind(this.controller));
    this.router.post(
      '/ping', 
      authMiddleware(this.authService),
      this.controller.protectedPing.bind(this.controller)
    );
  }

  getRoutes(): Router {
    return this.router;
  }
}