import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('authorization')
export class AuthorizationEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  auth_id: string;

  @Column({ type: 'varchar', name: 'auth_code', nullable: true })
  auth_code: string;

  @Column({ type: 'varchar', name: 'user_id', nullable: true })
  user_id: string;

  @Column({ type: 'varchar', name: 'state', nullable: true })
  state: string;

  @Column({ type: 'varchar', name: 'isExpired', nullable: true })
  isExpired: string;

  @Column({ type: 'varchar', name: 'ipAddress', nullable: true })
  ipAddress: string;

  /*
   * Create and Deletad Date Columns
   */
  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  public createdAt!: Date;

  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at', default: null })
  public deletedAt!: Date;
}
