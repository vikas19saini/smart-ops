import { MigrationInterface, QueryRunner } from 'typeorm';

export class Tenants1746271589356 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXIST "tenants" (
        "id" int NOT NULL AUTO_INCREMENT,
        "name" varchar(225) DEFAULT NULL,
        "address" varchar(225) DEFAULT NULL,
        "city" varchar(225) DEFAULT NULL,
        "state" varchar(225) DEFAULT NULL,
        "country" varchar(10) DEFAULT 'IN',
        "gstin" varchar(20) DEFAULT NULL,
        "status" tinyint(1) DEFAULT NULL,
        'created' timestamp DEFAULT CURRENT_TIMESTAMP,
        'updated' timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        "deleted" timestamp NULL DEFAULT NULL,
        PRIMARY KEY ("id")
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
        `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('Drop table tenants');
  }
}
