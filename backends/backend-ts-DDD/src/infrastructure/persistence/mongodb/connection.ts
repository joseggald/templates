import mongoose from 'mongoose';
import { env } from '../../config/environment.config';
import { Logger } from '../../logging/logger';

export class MongoDBConnection {
  static async connect(): Promise<void> {
    try {
      const mongoConfig = Object.values(env.databases).find(db => db.type === 'mongo' && db.enabled);
      
      if (!mongoConfig || !mongoConfig.url) {
        throw new Error('MongoDB URL not configured');
      }

      await mongoose.connect(mongoConfig.url);
      Logger.info('MongoDB connected successfully');
    } catch (error) {
      Logger.error('MongoDB connection error:', error);
      throw error;
    }
  }

  static async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
      Logger.info('MongoDB disconnected successfully');
    } catch (error) {
      Logger.error('MongoDB disconnection error:', error);
      throw error;
    }
  }
}