import * as path from 'path';
import { DataSource } from 'typeorm';

export class MigrationDataSource {
  constructor(
    private readonly host: string,
    private readonly username: string,
    private readonly password: string,
    private readonly port: number,
    private readonly database: string,
  ) {}

  getTenantConection() {
    return new DataSource({
      type: 'mysql',
      host: this.host,
      port: this.port,
      username: this.username,
      password: this.password,
      database: this.database,
      migrations: [path.resolve(process.cwd(), 'migrations/tenants/*.ts')],
    });
  }

  getMasterConnection() {
    return new DataSource({
      type: 'mysql',
      host: this.host,
      port: this.port,
      username: this.username,
      password: this.password,
      database: this.database,
      migrations: [path.resolve(process.cwd(), 'migrations/master/*.ts')],
    });
  }
}
