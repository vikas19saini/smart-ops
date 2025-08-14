import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './signin.dto';
import { Public } from '@common/auth.decorator';
import { UserService } from '@modules/users/user.service';
import { UserDto, UserResponseDto } from '@modules/users/user.dto';
import { plainToInstance } from 'class-transformer';

@Public()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('/signup')
  async signUp(@Body() user: UserDto) {
    return plainToInstance(
      UserResponseDto,
      await this.userService.create(user),
      {
        excludeExtraneousValues: true,
      },
    );
  }

  @Post('/signin')
  @HttpCode(200)
  async signIn(@Body() signInDto: SignInDto) {
    return await this.authService.signIn(signInDto);
  }
}
