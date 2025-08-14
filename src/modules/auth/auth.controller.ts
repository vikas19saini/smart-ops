import {
  Body,
  ConflictException,
  Controller,
  Logger,
  NotFoundException,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './signin.dto';
import { Public } from '@common/auth.decorator';
import { UserService } from '@modules/users/user.service';
import { UserDto } from '@modules/users/user.dto';
import { plainToInstance } from 'class-transformer';
import { UserEntity } from '@modules/users/user.entity';
import { ResponseMessages } from '@modules/users/user.response';

@Public()
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('/signup')
  async signUp(@Body() user: UserDto) {
    try {
      if (await this.userService.isUserExist(user)) {
        throw new ConflictException(ResponseMessages.USER_EXIST);
      }
      return plainToInstance(UserEntity, await this.userService.create(user), {
        excludeExtraneousValues: true,
      });
    } catch (err) {
      this.logger.error('Signup error', err);
    }
  }

  @Post('/signin')
  async signIn(@Body() signInDto: SignInDto) {
    try {
      const user = await this.userService.findUserByUsername(
        signInDto.username,
      );
      if (!user)
        throw new NotFoundException(`Username ${signInDto.username} not found`);

      if (!this.authService.isPasswordMatch(signInDto.password, user.password))
        throw new UnauthorizedException('Incorrrect username or password.');

      const accessToken = await this.authService.getAccessToken(user);
      return { accessToken };
    } catch (err) {
      this.logger.error('Sign in error', err);
    }
  }
}
