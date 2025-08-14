import { MigrationInterface, QueryRunner } from 'typeorm';

export class Users1745581921541 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`users\` (
        \`id\` INT NOT NULL AUTO_INCREMENT,
        \`email\` VARCHAR(225) NOT NULL,
        \`username\` VARCHAR(225) NOT NULL,
        \`first_name\` VARCHAR(225) DEFAULT NULL,
        \`last_name\` VARCHAR(225) DEFAULT NULL,
        \`password\` VARCHAR(225) DEFAULT NULL,
        \`phone\` VARCHAR(225) DEFAULT NULL,
        \`type\` ENUM('user', 'admin') NOT NULL DEFAULT 'user' COMMENT 'User role type',
        \`status\` ENUM('active', 'inactive') NOT NULL DEFAULT 'active' COMMENT 'User account status',
        \`created\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        \`updated\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        \`deleted\` TIMESTAMP NULL DEFAULT NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`email_UNIQUE\` (\`email\`),
        UNIQUE KEY \`phone_UNIQUE\` (\`phone\`),
        UNIQUE KEY \`username_UNIQUE\` (\`username\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS \`users\`;`);
  }
}
