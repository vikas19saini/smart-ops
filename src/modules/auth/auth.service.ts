import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './signin.dto';
import { UserEntity } from '@modules/users/user.entity';

import { PasswordService } from '@common/password.service';
import { DatabaseService } from '@database/database.service';
import { TenantContext } from '@tenancy/tenant.context';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<{ accessToken: string }> {
    const { username, password } = signInDto;
    const tenantId = TenantContext.getTenantId();

    const userRepository = this.databaseService.getRepository(UserEntity);

    const user = await userRepository.findOneBy({ username });

    if (!user) {
      this.logger.warn(`Login failed: User not found for username ${username}`);
      throw new NotFoundException('Incorrect email address');
    }

    const isMatch = await this.passwordService.comparePasswords(
      password,
      user.password,
    );

    if (!isMatch) {
      this.logger.warn(
        `Login failed: Invalid password for username ${username}`,
      );
      throw new UnauthorizedException('Incorrect password');
    }

    const payload = {
      user: plainToInstance(UserEntity, user, {
        excludeExtraneousValues: true,
      }),
      tenantId,
    };

    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken };
  }
}
