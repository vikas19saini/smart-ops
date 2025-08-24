import {
  Body,
  ConflictException,
  Controller,
  Get,
  Logger,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './user.dto';
import { ResponseMessages } from './user.response';
import { Roles } from '@common/role.decorator';
import { PaginationDto } from '@common/pagination.dto';

@Controller('user')
@Roles('user')
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

  @Get('/')
  get(@Query() paginationDto: PaginationDto) {
    try {
      return this.userService.getUserList(paginationDto);
    } catch (err) {
      this.logger.error('Get all users error', err);
    }
  }
}
