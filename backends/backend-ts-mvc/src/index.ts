import Server from './server';
import { Logger } from './utils/Logger';

const server = new Server();

process.on('unhandledRejection', (error: Error) => {
  Logger.error('Unhandled Rejection:', error);
  process.exit(1);
});

process.on('uncaughtException', (error: Error) => {
  Logger.error('Uncaught Exception:', error);
  process.exit(1);
});

server.start().catch((error: Error) => {
  Logger.error('Failed to start server:', error);
  process.exit(1);
});