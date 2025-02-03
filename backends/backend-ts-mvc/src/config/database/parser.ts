import { DatabaseType, DatabaseConfig } from './types';
import { Logger } from '../../utils/Logger';

export class DatabaseConfigParser {
  static parse(env: NodeJS.ProcessEnv): DatabaseConfig[] {
    const configs: DatabaseConfig[] = [];
    
    // Buscar todas las variables de entorno que contengan configuraciones de BD
    Object.entries(env).forEach(([key, value]) => {
      // MongoDB URLs (formato: MONGO_URL_[ALIAS])
      if (key.startsWith('MONGO_URL')) {
        const alias = key === 'MONGO_URL' ? 'default' : key.replace('MONGO_URL_', '').toLowerCase();
        configs.push({
          type: 'mongo',
          alias,
          url: value
        });
      }
      
      // PostgreSQL configs (formato: PG_[ALIAS]_HOST, PG_[ALIAS]_PORT, etc.)
      if (key.includes('PG_') && key.includes('_HOST')) {
        const aliasMatch = key.match(/PG_(.+)_HOST/);
        const alias = aliasMatch ? aliasMatch[1].toLowerCase() : 'default';
        const baseKey = alias === 'default' ? 'PG_' : `PG_${aliasMatch![1]}_`;
        
        configs.push({
          type: 'postgres',
          alias,
          host: env[`${baseKey}HOST`],
          port: parseInt(env[`${baseKey}PORT`] || '5432', 10),
          username: env[`${baseKey}USER`],
          password: env[`${baseKey}PASSWORD`],
          database: env[`${baseKey}DATABASE`]
        });
      }
      
      // MySQL configs (formato: MYSQL_[ALIAS]_HOST, MYSQL_[ALIAS]_PORT, etc.)
      if (key.includes('MYSQL_') && key.includes('_HOST')) {
        const aliasMatch = key.match(/MYSQL_(.+)_HOST/);
        const alias = aliasMatch ? aliasMatch[1].toLowerCase() : 'default';
        const baseKey = alias === 'default' ? 'MYSQL_' : `MYSQL_${aliasMatch![1]}_`;
        
        configs.push({
          type: 'mysql',
          alias,
          host: env[`${baseKey}HOST`],
          port: parseInt(env[`${baseKey}PORT`] || '3306', 10),
          username: env[`${baseKey}USER`],
          password: env[`${baseKey}PASSWORD`],
          database: env[`${baseKey}DATABASE`]
        });
      }
    });

    return configs;
  }
}