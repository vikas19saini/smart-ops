import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './signup.dto';
import { SignInDto } from './signin.dto';
import { Public } from '@common/auth.decorator';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() signupDto: SignupDto) {
    return await this.authService.create(signupDto);
  }

  @Post('/signin')
  @HttpCode(200)
  async signIn(@Body() signInDto: SignInDto) {
    return await this.authService.signIn(signInDto);
  }
}
