import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '@modules/users/user.entity';
import { PasswordService } from '@common/password.service';
import { TenantContext } from '@tenancy/tenant.context';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AuthService {
  constructor(
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  async isPasswordMatch(plainPassword: string, hashPassword: string) {
    return await this.passwordService.comparePasswords(
      plainPassword,
      hashPassword,
    );
  }

  async getAccessToken(user: UserEntity) {
    const tenantId = TenantContext.getTenantId();
    const payload = {
      user: plainToInstance(UserEntity, user, {
        excludeExtraneousValues: true,
      }),
      tenantId,
    };

    return await this.jwtService.signAsync(payload);
  }
}
