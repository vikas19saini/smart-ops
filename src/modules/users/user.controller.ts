import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/')
  async post(@Body() user: UserDto) {
    return await this.userService.create(user);
  }

  @Get()
  get() {}
}
