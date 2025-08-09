import { Injectable, Logger } from '@nestjs/common';
import { UserDto } from './user.dto';
import { DatabaseService } from '@database/database.service';
import { UserEntity } from './user.entity';
import { PasswordService } from '@common/password.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly dbService: DatabaseService,
    private readonly passwordService: PasswordService,
  ) {}

  async create(user: UserDto) {
    try {
      const userRepository = this.dbService.getRepository(UserEntity);
      user.password = await this.passwordService.hashPassword(user.password);
      return await userRepository.save(user);
    } catch (err) {
      this.logger.error('User createtion err: ', err?.message);
      throw err;
    }
  }
}
