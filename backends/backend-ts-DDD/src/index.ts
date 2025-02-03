import { DatabaseManager } from './infrastructure/config/database.config';
import { ExpressServer } from './infrastructure/server/express.server';
import { Logger } from './infrastructure/logging/logger';
import { env } from './infrastructure/config/environment.config';

async function bootstrap() {
  try {
    // Connect to databases
    await DatabaseManager.connectAll();
    Logger.info('Databases initialized successfully');
    Logger.info(`Active connections: ${DatabaseManager.getActiveConnections().join(', ')}`);

    // Start express server
    const server = new ExpressServer();
    await server.start();
    
  } catch (error) {
    Logger.error('Failed to start application:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  Logger.info('SIGTERM signal received. Closing application...');
  await DatabaseManager.disconnectAll();
  process.exit(0);
});

process.on('SIGINT', async () => {
  Logger.info('SIGINT signal received. Closing application...');
  await DatabaseManager.disconnectAll();
  process.exit(0);
});

// Handle uncaught errors
process.on('unhandledRejection', (reason, promise) => {
  Logger.error(`Unhandled Rejection at: ${reason}`, promise);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  Logger.error('Uncaught Exception:', error);
  process.exit(1);
});

bootstrap();