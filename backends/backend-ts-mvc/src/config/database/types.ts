export type DatabaseType = 'mongo' | 'postgres' | 'mysql';

export interface DatabaseConfig {
  type: DatabaseType;
  alias: string;
  url?: string;
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  database?: string;
}