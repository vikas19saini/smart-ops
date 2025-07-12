import { Module } from '@nestjs/common';
import { TenantModule } from './modules/tenant/tenant.module';

import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@modules/auth/auth.module';
import { AuthGuard } from '@common/auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TenantModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
