import mongoose from 'mongoose';
import { Pool } from 'pg';
import mysql from 'mysql2/promise';
import { DatabaseConfig } from './types';
import { Logger } from '../../utils/Logger';
import { DatabaseConfigParser } from './parser';

class DatabaseManager {
  private static instance: DatabaseManager;
  private connections: Map<string, any> = new Map();
  private configs: Map<string, DatabaseConfig> = new Map();
  private readonly CONNECTION_TIMEOUT = 15000; // 15 segundos

  private constructor() {}

  static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  async initialize(): Promise<void> {
    try {
      const configs = DatabaseConfigParser.parse(process.env);
      
      if (configs.length === 0) {
        await Logger.warn('No database configurations found in environment variables');
      }
      
      for (const config of configs) {
        const connectionKey = `${config.type}-${config.alias}`;
        this.configs.set(connectionKey, config);
        // Log de la configuración sin datos sensibles
        const sanitizedConfig = { ...config };
        delete sanitizedConfig.password;
      }
    } catch (error) {
      await Logger.error('Error parsing database configurations:', error);
      throw error;
    }
  }

  async connect(connectionKey?: string): Promise<void> {
    try {
      if (connectionKey) {
        await this.connectOne(connectionKey);
      } else {
        const connections = Array.from(this.configs.keys());
        await Logger.info(`Connecting to databases: ${connections.join(', ')}`);
        
        for (const key of connections) {
          await this.connectOne(key);
        }
      }
    } catch (error) {
      await Logger.error('Database connection error:', error);
      throw error;
    }
  }

  private async connectOne(connectionKey: string): Promise<void> {
    const config = this.configs.get(connectionKey);
    if (!config) {
      throw new Error(`No configuration found for ${connectionKey}`);
    }

    try {
      const connectionPromise = this.createConnection(config);
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error(`Connection timeout for ${connectionKey}`)), 
          this.CONNECTION_TIMEOUT);
      });

      const connection = await Promise.race([connectionPromise, timeoutPromise]);
      this.connections.set(connectionKey, connection);
      
      await Logger.ok(`Connected to database: ${connectionKey}`);
      
      // Configurar event listeners para MongoDB
      if (config.type === 'mongo' && connection) {
        connection.on('error', async (error: Error) => {
          await Logger.error(`MongoDB connection error (${connectionKey}):`, error);
        });
        
        connection.on('disconnected', async () => {
          await Logger.warn(`MongoDB disconnected (${connectionKey})`);
        });
        
        connection.on('reconnected', async () => {
          await Logger.ok(`MongoDB reconnected (${connectionKey})`);
        });
      }
    } catch (error) {
      await Logger.error(`Failed to connect to ${connectionKey}:`, error);
      throw error;
    }
  }

  private async createConnection(config: DatabaseConfig): Promise<any> {
    switch (config.type) {
      case 'mongo':
        if (!config.url) {
          throw new Error(`MongoDB URL required for ${config.alias}`);
        }
        await Logger.debug(`Creating MongoDB connection for ${config.alias}...`);
        return mongoose.createConnection(config.url, {
          serverSelectionTimeoutMS: this.CONNECTION_TIMEOUT,
          connectTimeoutMS: this.CONNECTION_TIMEOUT,
          socketTimeoutMS: this.CONNECTION_TIMEOUT
        });

      case 'postgres':
        await Logger.debug(`Creating PostgreSQL connection for ${config.alias}...`);
        return new Pool({
          host: config.host,
          port: config.port,
          user: config.username,
          password: config.password,
          database: config.database,
          connectionTimeoutMillis: this.CONNECTION_TIMEOUT
        });

      case 'mysql':
        await Logger.debug(`Creating MySQL connection for ${config.alias}...`);
        return mysql.createConnection({
          host: config.host,
          port: config.port,
          user: config.username,
          password: config.password,
          database: config.database,
          connectTimeout: this.CONNECTION_TIMEOUT
        });

      default:
        throw new Error(`Unsupported database type: ${config.type}`);
    }
  }

  getConnection(type: string, alias: string = 'default'): any {
    const connectionKey = `${type}-${alias}`;
    const connection = this.connections.get(connectionKey);
    
    if (!connection) {
      throw new Error(`No active connection for ${connectionKey}`);
    }
    
    return connection;
  }

  async disconnect(): Promise<void> {
    for (const [key, connection] of this.connections) {
      try {
        await Logger.info(`Disconnecting from ${key}...`);
        if (connection?.close) await connection.close();
        if (connection?.end) await connection.end();
        await Logger.info(`Disconnected from ${key}`);
      } catch (error) {
        await Logger.error(`Error disconnecting from ${key}:`, error);
      }
    }
    this.connections.clear();
  }
}

export const dbManager = DatabaseManager.getInstance();