import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('auth_logs')
export class AuthLogsEntitiy extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  log_id: string;

  @Column({ type: 'varchar', name: 'auth_code', nullable: true })
  auth_code: string;

  @Column({ type: 'varchar', name: 'event_type', nullable: true })
  eventType: string;

  @Column({ type: 'varchar', name: 'ip_address', nullable: true })
  ipAddress: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  public updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at', default: null })
  public deletedAt!: Date;
}
