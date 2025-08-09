import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PasswordService } from '@common/password.service';

@Module({
  providers: [UserService, PasswordService],
  controllers: [UserController],
})
export class UserModule {}
