import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {
  @CreateDateColumn({ name: 'created', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted',
    type: 'timestamp',
    select: false,
    nullable: true,
  })
  deletedAt: Date;
}
