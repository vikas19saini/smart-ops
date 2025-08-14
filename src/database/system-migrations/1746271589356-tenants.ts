import { MigrationInterface, QueryRunner } from 'typeorm';

export class Tenants1746271589356 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`tenants\` (
        \`id\` INT NOT NULL AUTO_INCREMENT,
        \`name\` VARCHAR(225) DEFAULT NULL,
        \`domain\` VARCHAR(225) DEFAULT NULL,
        \`status\` TINYINT(1) DEFAULT NULL,
        \`created\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        \`updated\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        \`deleted\` TIMESTAMP NULL DEFAULT NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`UQ_tenants_domain\` (\`domain\`),
        INDEX \`IDX_tenants_domain\` (\`domain\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS \`tenants\``);
  }
}
