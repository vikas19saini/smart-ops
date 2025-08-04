import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';

const dbEnv = {
  hostname: process.env.DB_HOST_NAME || 'localhost',
  port: parseInt(process.env.DB_PORT_NUMBER || '3306'),
  database: process.env.DB_NAME || '',
  username: process.env.DB_USER_NAME || '',
  password: process.env.DB_PASSWORD || '',
  prefix: process.env.TENANT_DB_PREFIX || '',
  type: 'mysql' as const,
};

/**
 * Get DataSourceOptions for a given database type (master or tenant)
 */
function getDataSourceOptions(
  dbName: string,
  mode: 'master' | 'tenant',
): DataSourceOptions {
  return {
    type: dbEnv.type,
    host: dbEnv.hostname,
    port: dbEnv.port,
    username: dbEnv.username,
    password: dbEnv.password,
    database: dbName,

    migrations: [
      mode === 'master'
        ? join(__dirname, 'system-migrations', '*.{ts,js}')
        : join(__dirname, 'migrations', '*.{ts,js}'),
    ],
    logging: true,
    synchronize: false,
  };
}

/**
 * Run or revert migrations
 */
async function runMigration(dataSource: DataSource, action: string) {
  await dataSource.initialize();
  console.log(`[✔] Connected to DB: ${dataSource.options.database}`);

  if (action.toLowerCase() === 'revert') {
    await dataSource.undoLastMigration();
    console.log(
      `[↩] Reverted last migration on: ${dataSource.options.database}`,
    );
  } else {
    await dataSource.runMigrations();
    console.log(`[↑] Ran migrations on: ${dataSource.options.database}`);
  }

  await dataSource.destroy();
  console.log(`[✖] Connection closed for: ${dataSource.options.database}`);
}

(async () => {
  const dbTypeArg = process.argv[2];
  const action = process.argv[3] || 'run';

  if (!dbTypeArg) {
    console.error(
      '❌ Usage: ts-node migration-runner.ts <master|tenant-<id>> <run|revert>',
    );
    process.exit(1);
  }

  try {
    let dbName = '';
    let mode: 'master' | 'tenant';

    if (dbTypeArg === 'master') {
      dbName = dbEnv.database;
      mode = 'master';
    } else if (dbTypeArg.startsWith('tenant-')) {
      const tenantId = dbTypeArg.split('-')[1];
      if (!tenantId) throw new Error('Missing tenant ID in argument');
      dbName = `${dbEnv.prefix}${tenantId}`;
      mode = 'tenant';
    } else {
      throw new Error(`Invalid argument: ${dbTypeArg}`);
    }

    const dataSource = new DataSource(getDataSourceOptions(dbName, mode));
    await runMigration(dataSource, action);
  } catch (err) {
    console.log(err);
    console.error('❌ Migration error:', err.message);
    process.exit(1);
  }

  process.exit(0);
})();
