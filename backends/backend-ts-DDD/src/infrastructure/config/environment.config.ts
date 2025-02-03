import dotenv from 'dotenv';
dotenv.config();

interface DatabaseConfig {
  enabled: boolean;
  type: string;
  url?: string;
  host?: string;
  port?: number;
  user?: string;
  password?: string;
  database?: string;
}

interface DatabaseConfigs {
  [key: string]: DatabaseConfig;
}

interface Environment {
  port: number;
  databases: DatabaseConfigs;
  jwt: {
    secret: string;
    expiresIn: string;
    refreshExpiry: string;
  };
}

function getDatabaseConfigs(): DatabaseConfigs {
  const configs: DatabaseConfigs = {};

  // MongoDB configurations
  if (process.env.MONGO_URL && !process.env.MONGO_URL.startsWith('#')) {
    configs.mongodb = {
      enabled: true,
      type: 'mongo',
      url: process.env.MONGO_URL
    };
  }

  // Postgres configurations
  if (process.env.PG_HOST && !process.env.PG_HOST.startsWith('#')) {
    configs.postgres = {
      enabled: true,
      type: 'postgres',
      host: process.env.PG_HOST,
      port: parseInt(process.env.PG_PORT || '5432'),
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE
    };
  }

  // MySQL configurations
  if (process.env.MYSQL_HOST && !process.env.MYSQL_HOST.startsWith('#')) {
    configs.mysql = {
      enabled: true,
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: parseInt(process.env.MYSQL_PORT || '3306'),
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE
    };
  }

  return configs;
}

export const env: Environment = {
  port: parseInt(process.env.PORT || '3000'),
  databases: getDatabaseConfigs(),
  jwt: {
    secret: process.env.JWT_SECRET || 'default_secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    refreshExpiry: process.env.JWT_REFRESH_EXPIRY || '7d'
  }
};