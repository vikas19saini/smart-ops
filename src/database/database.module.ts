import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DataSourceConfig } from './datasource.config';
import { DatabaseService } from './database.service';

@Module({
  imports: [ConfigModule.forFeature(DataSourceConfig)],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
