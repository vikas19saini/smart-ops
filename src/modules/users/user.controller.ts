import {
  Body,
  ConflictException,
  Controller,
  Get,
  Logger,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './user.dto';
import { ResponseMessages } from './user.response';

@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private readonly userService: UserService) {}

  @Post('/')
  async post(@Body() user: UserDto) {
    try {
      if (await this.userService.isUserExist(user)) {
        throw new ConflictException(ResponseMessages.USER_EXIST);
      }
      return await this.userService.create(user);
    } catch (err) {
      this.logger.error('Create user error', err);
    }
  }

  @Get()
  get() {}
}
