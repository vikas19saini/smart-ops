import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Users1745581921541 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS 'users' (
        'id' int NOT NULL AUTO_INCREMENT,
        'email' varchar(225) NOT NULL,
        'first_name' varchar(225) DEFAULT NULL,
        'last_name' varchar(225) DEFAULT NULL,
        'password' varchar(225) DEFAULT NULL,
        'phone' varchar(225) DEFAULT NULL,
        'type' varchar(50) DEFAULT NULL,
        'status' varchar(50) DEFAULT NULL,
        'tenant_id' int NOT NULL,
        'created' timestamp DEFAULT CURRENT_TIMESTAMP,
        'updated' timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        'deleted' timestamp NULL DEFAULT NULL,
        PRIMARY KEY ('id'),
        UNIQUE KEY 'email_UNIQUE' ('email'),
        UNIQUE KEY 'phone_UNIQUE' ('phone'),
        KEY 'tenantId_idx' ('tenant_id'),
        CONSTRAINT 'tenantId' FOREIGN KEY ('tenant_id') REFERENCES 'tenants' ('id') ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP table users;');
  }
}
