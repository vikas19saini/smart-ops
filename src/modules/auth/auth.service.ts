import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import { SignInDto } from './signin.dto';

import { UserEntity } from '@modules/users/user.entity';
import { UserStatus } from 'src/interfaces/user.type';
import { PasswordService } from '@common/password.service';
import { DatabaseService } from '@database/database.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<{ accessToken: string }> {
    const { email, password } = signInDto;

    const userRepository = this.databaseService.getRepository(UserEntity);

    const user = await userRepository.findOneBy({ email });

    if (!user) {
      this.logger.warn(`Login failed: User not found for email ${email}`);
      throw new NotFoundException('Incorrect email address');
    }

    const isMatch = await this.passwordService.comparePasswords(
      password,
      user.password,
    );

    if (!isMatch) {
      this.logger.warn(`Login failed: Invalid password for email ${email}`);
      throw new UnauthorizedException('Incorrect password');
    }

    const payload = {
      userId: user.id,
      email: user.email,
      type: user.type,
    };

    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken };
  }
}
