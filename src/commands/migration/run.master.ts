import { MigrationDataSource } from './datasource';
import { dbEnv } from './db.env';

(async () => {
  try {
    const action: string | undefined = process.argv[2];
    const connection = new MigrationDataSource(
      dbEnv.hostname,
      dbEnv.username,
      dbEnv.password,
      dbEnv.port,
      dbEnv.database,
    ).getMasterConnection();

    await connection.initialize();

    if (action?.toLocaleLowerCase() === 'revert') {
      await connection.undoLastMigration();
    } else {
      await connection.runMigrations();
    }

    await connection.destroy();
  } catch (err) {
    console.log(err);
  } finally {
    process.exit(1);
  }
})();
