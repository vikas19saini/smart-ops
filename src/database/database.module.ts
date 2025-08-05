import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { DatasourceFactoryService } from './datasource.service';

@Global()
@Module({
  imports: [],
  providers: [DatabaseService, DatasourceFactoryService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
