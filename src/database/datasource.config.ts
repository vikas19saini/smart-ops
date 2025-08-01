import { ConfigService, registerAs } from '@nestjs/config';

export const DataSourceConfig = registerAs('dataSourceConfig', () => {
  const configService = new ConfigService();

  return {
    type: configService.getOrThrow('DB_TYPE'),
    host: configService.getOrThrow('DB_HOST_NAME'),
    username: configService.getOrThrow('DB_USER_NAME'),
    password: configService.getOrThrow('DB_PASSWORD'),
    port: configService.getOrThrow('DB_PORT_NUMBER'),
    database: configService.getOrThrow('DB_NAME'),
    logging: configService.getOrThrow('DB_LOGGING', false),
    tenantDbPrefix: configService.getOrThrow('TENANT_DB_PREFIX'),
  };
});
