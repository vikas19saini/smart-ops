import { Injectable, Logger } from '@nestjs/common';
import { UserDto } from './user.dto';
import { DatabaseService } from '@database/database.service';
import { UserEntity } from './user.entity';
import { PasswordService } from '@common/password.service';

import { UserStatus } from '@interfaces/user.type';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly dbService: DatabaseService,
    private readonly passwordService: PasswordService,
  ) {}

  private getUserRepo() {
    return this.dbService.getRepository(UserEntity);
  }

  async isUserExist(user: UserDto) {
    return await this.getUserRepo().exists({
      where: [
        { email: user.email },
        { phone: user.phone },
        { username: user.username },
      ],
    });
  }

  async create(user: UserDto) {
    try {
      const userRepository = this.getUserRepo();
      user.status = UserStatus.ACTIVE;
      user.password = await this.passwordService.hashPassword(user.password);
      return await userRepository.save(user);
    } catch (err) {
      this.logger.error('User createtion err: ', err?.message);
      throw err;
    }
  }
}
