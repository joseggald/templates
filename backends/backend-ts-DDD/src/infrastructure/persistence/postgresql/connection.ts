import { Pool } from 'pg';
import { env } from '../../config/environment.config';
import { Logger } from '../../logging/logger';

export class PostgresConnection {
  private static pool: Pool;

  static async connect(): Promise<void> {
    try {
      const pgConfig = Object.values(env.databases).find(db => db.type === 'postgres' && db.enabled);
      
      if (!pgConfig) {
        throw new Error('PostgreSQL configuration not found');
      }

      this.pool = new Pool({
        host: pgConfig.host,
        port: pgConfig.port,
        user: pgConfig.user,
        password: pgConfig.password,
        database: pgConfig.database
      });

      // Test connection
      await this.pool.query('SELECT NOW()');
      Logger.info('PostgreSQL connected successfully');
    } catch (error) {
      Logger.error('PostgreSQL connection error:', error);
      throw error;
    }
  }

  static async disconnect(): Promise<void> {
    try {
      if (this.pool) {
        await this.pool.end();
        Logger.info('PostgreSQL disconnected successfully');
      }
    } catch (error) {
      Logger.error('PostgreSQL disconnection error:', error);
      throw error;
    }
  }

  static getPool(): Pool {
    return this.pool;
  }
}