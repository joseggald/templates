import express, { Application } from 'express';
import { environment } from './config/environment';
import { Logger } from './utils/Logger';
import { dbManager } from './config/database';
import { initializeMiddlewares } from './middlewares/index';
import { initializeRoutes } from './routes';
import { errorHandler } from './middlewares/errorHandler';
import { Connection } from 'mongoose';

export default class Server {
  private app: Application;
  private mongoConnection: Connection | null = null;

  constructor() {
    // Log síncrono inmediato
    Logger.info('Initializing server...');
    this.app = express();
    this.setup();
  }

  private setup(): void {
    Logger.info('Setting up server...');
    initializeMiddlewares(this.app);
    initializeRoutes(this.app);
    this.app.use(errorHandler);
    Logger.ok('Server setup completed');
  }
  
  private async initializeDatabase(): Promise<void> {
    try {
      Logger.info('Initializing databases...');
      await dbManager.initialize();
      await dbManager.connect();
      
      this.mongoConnection = await dbManager.getConnection('mongo', 'default');
      
      if (this.mongoConnection) {
        this.mongoConnection.on('connected', () => {
          Logger.ok('Instance connected to MongoDB');
        });

        this.mongoConnection.on('error', (error) => {
          Logger.error(`MongoDB error: ${error.message}`);
        });

        this.mongoConnection.on('disconnected', () => {
          Logger.error('MongoDB disconnected');
        });

        if (this.mongoConnection.readyState !== 1) {
          await new Promise<void>((resolve, reject) => {
            const timeout = setTimeout(() => {
              reject(new Error('MongoDB connection timeout'));
            }, 10000);

            this.mongoConnection!.on('connected', () => {
              clearTimeout(timeout);
              resolve();
            });

            this.mongoConnection!.on('error', (error) => {
              clearTimeout(timeout);
              reject(error);
            });
          });
        }
      }
    } catch (error) {
      Logger.error((error as Error).message);
      throw error;
    }
  }

  public async start(): Promise<void> {
    try {
      Logger.info('Starting server...');
      await this.initializeDatabase();
      
      const server = this.app.listen(environment.PORT, () => {
        Logger.ok(`Server running on port ${environment.PORT} - ${environment.NODE_ENV}`);
        Logger.info(`Health check: GET-http://localhost:${environment.PORT}/ && POST-http://localhost:${environment.PORT}/ { ping:1 }`);
        this.logServerInfo();
      });

      server.on('error', (error: Error) => {
        Logger.error(`HTTP server error: ${error.message}`);
        this.shutdown(1);
      });

      process.on('SIGTERM', () => this.shutdown());
      process.on('SIGINT', () => this.shutdown());

    } catch (error) {
      Logger.error(`Server start failed: ${(error as Error).message}`);
      await this.shutdown(1);
    }
  }

  private async shutdown(code: number = 0): Promise<void> {
    try {
      Logger.info('Server shutting down...');
      await dbManager.disconnect();
      process.exit(code);
    } catch (error) {
      Logger.error(`Error during shutdown: ${(error as Error).message}`);
      process.exit(1);
    }
  }

  private logServerInfo(): void {
    const memoryUsage = process.memoryUsage();
    Logger.debug('Server Information',{
      environment: environment.NODE_ENV,
      nodeVersion: process.version,
      memoryUsage: {
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`
      },
      pid: process.pid
    });
  }

  public getApp(): Application {
    return this.app;
  }
}