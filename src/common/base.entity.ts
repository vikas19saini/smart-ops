import { Exclude, Expose } from 'class-transformer';
import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {
  @Expose()
  @CreateDateColumn({ name: 'created', type: 'timestamp' })
  createdAt: Date;

  @Expose()
  @UpdateDateColumn({ name: 'updated', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted',
    type: 'timestamp',
    select: false,
    nullable: true,
  })
  @Exclude()
  deletedAt: Date;
}
