import { MongoDBConnection } from '../persistence/mongodb/connection';
import { PostgresConnection } from '../persistence/postgresql/connection';
import { MySQLConnection } from '../persistence/mysql/connection';
import { env } from './environment.config';
import { Logger } from '../logging/logger';

export class DatabaseManager {
  private static activeConnections: Set<string> = new Set();

  static async connectAll(): Promise<void> {
    try {
      const connectionPromises = Object.entries(env.databases)
        .filter(([_, config]) => config.enabled)
        .map(([name, config]) => this.connectDatabase(name, config));

      await Promise.all(connectionPromises);
      Logger.info('All database connections established successfully');
    } catch (error) {
      Logger.error('Error connecting to databases:', error);
      throw error;
    }
  }

  private static async connectDatabase(name: string, config: any): Promise<void> {
    try {
      switch (config.type) {
        case 'mongo':
          await MongoDBConnection.connect();
          break;
        case 'postgres':
          await PostgresConnection.connect();
          break;
        case 'mysql':
          await MySQLConnection.connect();
          break;
        default:
          Logger.warn(`Unsupported database type for ${name}: ${config.type}`);
          return;
      }

      this.activeConnections.add(name);
      Logger.success(`Connected to database: ${name}`);
    } catch (error) {
      Logger.error(`Failed to connect to database ${name}:`, error);
      throw error;
    }
  }

  static async disconnectAll(): Promise<void> {
    try {
      const disconnectionPromises = Array.from(this.activeConnections).map(name => {
        const config = env.databases[name];
        return this.disconnectDatabase(name, config);
      });

      await Promise.all(disconnectionPromises);
      this.activeConnections.clear();
      Logger.info('All database connections closed successfully');
    } catch (error) {
      Logger.error('Error disconnecting from databases:', error);
      throw error;
    }
  }

  private static async disconnectDatabase(name: string, config: any): Promise<void> {
    try {
      switch (config.type) {
        case 'mongo':
          await MongoDBConnection.disconnect();
          break;
        case 'postgres':
          await PostgresConnection.disconnect();
          break;
        case 'mysql':
          await MySQLConnection.disconnect();
          break;
      }
      Logger.success(`Disconnected from database: ${name}`);
    } catch (error) {
      Logger.error(`Failed to disconnect from database ${name}:`, error);
      throw error;
    }
  }

  static getActiveConnections(): string[] {
    return Array.from(this.activeConnections);
  }
}