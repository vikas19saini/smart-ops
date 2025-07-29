import { MigrationDataSource } from './datasource';
import { dbEnv } from './db.env';

(async () => {
  try {
    console.info('------- Master Migration Started -------');
    const action: string | undefined = process.argv[2];
    console.log(action);
    const connection = new MigrationDataSource(
      dbEnv.hostname,
      dbEnv.username,
      dbEnv.password,
      dbEnv.port,
      dbEnv.database,
    ).getMasterConnection();
    console.info('------- Master Migration Initializing -------');
    await connection.initialize();
    if (action?.toLocaleLowerCase() === 'revert') {
      console.info('------- Master Migration Revrting -------');
      await connection.undoLastMigration();
      console.info('------- Master Migration Reverted -------');
    } else {
      console.info('------- Master Migration Sync Started -------');
      await connection.runMigrations();
      console.info('------- Master Migration Sync Done -------');
    }
  } catch (err) {
    console.info('------- Master Migration Error -------');
    console.log(err);
  } finally {
    console.info('------- Master Migration Closed -------');
    process.exit(1);
  }
})();
