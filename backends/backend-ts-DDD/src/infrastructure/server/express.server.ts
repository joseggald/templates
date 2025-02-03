import express, { Application } from 'express';
import cors from 'cors';
import { Logger } from '../logging/logger';
import { Routes } from './routes';
import { env } from '../config/environment.config';

export class ExpressServer {
  private app: Application;

  constructor() {
    this.app = express();
    this.setupMiddlewares();
    this.setupRoutes();
  }

  private setupMiddlewares(): void {
    this.app.use(cors());
    this.app.use(express.json());
  }

  private setupRoutes(): void {
    const routes = new Routes();
    this.app.use('/', routes.getRoutes());
  }

  async start(): Promise<void> {
    try {
      this.app.listen(env.port, () => {
        Logger.info(`Server is running on port ${env.port}`);
      });
    } catch (error) {
      Logger.error('Error starting server:', error);
      throw error;
    }
  }
}