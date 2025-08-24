import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '@modules/users/user.entity';
import { PasswordService } from '@common/password.service';
import { TenantContext } from '@tenancy/tenant.context';
import { plainToInstance } from 'class-transformer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async isPasswordMatch(plainPassword: string, hashPassword: string) {
    return await this.passwordService.comparePasswords(
      plainPassword,
      hashPassword,
    );
  }

  async getAccessToken(user: UserEntity, generateRefreshToken = false) {
    const tenantId = TenantContext.getTenantId();
    const payload = {
      user: plainToInstance(UserEntity, user, {
        excludeExtraneousValues: true,
      }),
      tenantId,
    };

    if (generateRefreshToken) {
      return await this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      });
    }

    return await this.jwtService.signAsync(payload);
  }

  async refreshAccessToken(refreshToken: string) {
    const tokenPayload = await this.jwtService.verifyAsync(refreshToken, {
      secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
    });

    const user = tokenPayload.user as UserEntity;
    return this.getAccessToken(user);
  }
}
