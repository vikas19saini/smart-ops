import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';

@Injectable()
export class DatasourceFactoryService {
  constructor(private readonly config: ConfigService) {}

  public async create(
    options: Partial<{ tenantId: any; createIfNotExist?: boolean }>,
  ): Promise<DataSource> {
    const isTenant = !!options.tenantId;
    const tenantId = options.tenantId;

    const dbName = isTenant
      ? `${this.config.getOrThrow('TENANT_DB_PREFIX')}${tenantId}`
      : this.config.getOrThrow('DB_NAME');

    if (options.createIfNotExist) await this.ensureDatabaseExists(dbName);

    const dataSourceOptions: DataSourceOptions = {
      type: 'mysql',
      host: this.config.getOrThrow('DB_HOST_NAME'),
      port: this.config.getOrThrow<number>('DB_PORT_NUMBER'),
      username: this.config.getOrThrow('DB_USER_NAME'),
      password: this.config.getOrThrow('DB_PASSWORD'),
      database: dbName,
      logging: this.config.getOrThrow<boolean>('DB_LOGGING'),
      entities: isTenant
        ? [join(__dirname, '..', 'modules', '**', '*.entity.{ts,js}')]
        : [join(__dirname, '..', 'tenancy', '**', '*.entity.{ts,js}')],
      migrations: isTenant
        ? [join(__dirname, 'migrations', '**', '*.{ts,js}')]
        : [],
      synchronize: false,
    };

    const dataSource = new DataSource(dataSourceOptions);
    await dataSource.initialize();

    return dataSource;
  }

  private async ensureDatabaseExists(dbName: string): Promise<void> {
    const tempDataSource = new DataSource({
      type: 'mysql',
      host: this.config.getOrThrow('DB_HOST_NAME'),
      port: this.config.getOrThrow<number>('DB_PORT_NUMBER'),
      username: this.config.getOrThrow('DB_USER_NAME'),
      password: this.config.getOrThrow('DB_PASSWORD'),
    });

    await tempDataSource.initialize();

    const result = await tempDataSource.query(`SHOW DATABASES LIKE ?`, [
      dbName,
    ]);
    const dbExists = result.length > 0;

    if (!dbExists) {
      await tempDataSource.query(`CREATE DATABASE \`${dbName}\``);
      console.log(`✅ Created database: ${dbName}`);
    }

    await tempDataSource.destroy();
  }
}
