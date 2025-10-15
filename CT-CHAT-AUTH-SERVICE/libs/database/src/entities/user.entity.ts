import { Exclude } from 'class-transformer';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FCMTokenEntity } from './fcm_token.entity';

interface UserData {
  referredId: number;
  referredRole: number;
  businessName: string;
  parent_id: number;
  isActive: boolean;
}

@Entity('user')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  cred_id: string;

  @Column({
    type: 'varchar',
    name: 'user_id',
    nullable: true,
  })
  user_id: string;

  @Column({
    type: 'varchar',
    name: 'email',
    nullable: false,
    unique: false,
  })
  email: string;

  @Column({
    type: 'varchar',
    name: 'password',
    nullable: true,
  })
  password: string;

  @Column({
    type: 'varchar',
    name: 'username',
    nullable: true,
  })
  username: string;

  @Column({ type: 'varchar', name: 'first_name', nullable: true })
  firstName: string;
  @Column({ type: 'varchar', name: 'last_name', nullable: true })
  lastName: string;

  @Column({ type: 'varchar', name: 'profile_pic', nullable: true })
  profilePic: string;

  @Column({
    type: 'int',
    name: 'org_id',
    nullable: true,
  })
  org_id: number;

  @Column({
    type: 'int',
    name: 'role',
    nullable: true,
  })
  role: number;

  @Column({
    type: 'int',
    name: 'parent_id',
    nullable: true,
  })
  parent_id: number;

  @Column({
    type: 'int',
    name: 'parentActive',
    nullable: true,
    default: 1
  })
  parentActive: number;

  @Column({
    type: 'boolean',
    name: 'chatEnabled',
    nullable: true,
    default: true
  })
  chatEnabled: boolean;

  @Column({ type: 'varchar', name: 'businessName', nullable: true })
  businessName: string;

  @OneToMany(() => FCMTokenEntity, (fcmToken) => fcmToken.user, { cascade: true })
  fcmTokens: FCMTokenEntity[];

  @Column({
    type: 'varchar',
    name: 'lastLoginAt',
    nullable: true,
  })
  lastLoginAt: string;

  @Column({
    type: 'text',
    name: 'refresh_token',
    nullable: true,
  })
  refreshToken: string;

  @Column({
    type: 'text',
    name: 'reset_token',
    nullable: true,
  })
  resetToken: string;

  //userData
  //Custom User-DATA
  @Column('jsonb', { nullable: true })
  userData: UserData[];

  /*
   * Create and Update Date Columns
   */
  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  public updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at' })
  public deletedAt!: Date;
}
