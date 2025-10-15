import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('client')
export class ClientEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  client_id: string;

  @Column({ type: 'varchar', name: 'client_secret_key', nullable: true })
  client_secret_key: string;

  @Column({ type: 'varchar', name: 'api_key', nullable: true })
  apiKey: string;

  @Column({ type: 'int', name: 'org_id', nullable: true })
  org_id: number;

  /*
   * Create and Update Date Columns
   */
  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  public updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at', default: null })
  public deletedAt!: Date;
}
