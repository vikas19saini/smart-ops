import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import { SignupDto } from './signup.dto';
import { SignInDto } from './signin.dto';
import { TenantEntity } from '@modules/tenant/tenant.entity';
import { UserEntity } from '@modules/users/user.entity';
import { UserStatus } from 'src/interfaces/user.type';
import { PasswordService } from '@common/password.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(TenantEntity)
    private readonly tenantRepository: Repository<TenantEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Register a new user and tenant
   */
  async create(signupData: SignupDto): Promise<void> {
    const { user, company } = signupData;

    const existingUser = await this.userRepository.findOne({
      where: [{ email: user.email }, { phone: user.phone }],
    });

    if (existingUser) {
      this.logger.warn(
        `User already exists with email: ${user.email} or phone: ${user.phone}`,
      );
      throw new ConflictException(
        `Email (${user.email}) or phone number (${user.phone}) is already in use.`,
      );
    }

    try {
      const savedCompany = await this.tenantRepository.save(company);

      user.tenantId = savedCompany.id;
      user.status = UserStatus.ACTIVE;
      user.password = await this.passwordService.hashPassword(user.password);

      await this.userRepository.save(user);

      this.logger.log(`User registered: ${user.email}`);
    } catch (err) {
      this.logger.error('Failed to create user', err.stack);
      throw err;
    }
  }

  /**
   * Sign in a user and return JWT access token
   */
  async signIn(signInDto: SignInDto): Promise<{ accessToken: string }> {
    const { email, password } = signInDto;

    const user = await this.userRepository.findOneBy({ email });

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
      tenantId: user.tenantId,
    };

    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken };
  }
}
