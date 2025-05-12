import { Module } from '@nestjs/common';
import { TenantModule } from './modules/tenant/tenant.module';

import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TenantModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
