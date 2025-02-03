import mysql from 'mysql2/promise';
import { env } from '../../config/environment.config';
import { Logger } from '../../logging/logger';

export class MySQLConnection {
  private static pool: mysql.Pool;

  static async connect(): Promise<void> {
    try {
      const mysqlConfig = Object.values(env.databases).find(db => db.type === 'mysql' && db.enabled);
      
      if (!mysqlConfig) {
        throw new Error('MySQL configuration not found');
      }

      this.pool = mysql.createPool({
        host: mysqlConfig.host,
        port: mysqlConfig.port,
        user: mysqlConfig.user,
        password: mysqlConfig.password,
        database: mysqlConfig.database
      });

      // Test connection
      await this.pool.query('SELECT 1');
      Logger.info('MySQL connected successfully');
    } catch (error) {
      Logger.error('MySQL connection error:', error);
      throw error;
    }
  }

  static async disconnect(): Promise<void> {
    try {
      if (this.pool) {
        await this.pool.end();
        Logger.info('MySQL disconnected successfully');
      }
    } catch (error) {
      Logger.error('MySQL disconnection error:', error);
      throw error;
    }
  }

  static getPool(): mysql.Pool {
    return this.pool;
  }
}