import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './signin.dto';
import { Public } from '@common/auth.decorator';
import { UserService } from '@modules/users/user.service';
import { UserDto } from '@modules/users/user.dto';
import { plainToInstance } from 'class-transformer';
import { UserEntity } from '@modules/users/user.entity';

@Public()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('/signup')
  async signUp(@Body() user: UserDto) {
    return plainToInstance(UserEntity, await this.userService.create(user), {
      excludeExtraneousValues: true,
    });
  }

  @Post('/signin')
  async signIn(@Body() signInDto: SignInDto) {
    return await this.authService.signIn(signInDto);
  }
}
