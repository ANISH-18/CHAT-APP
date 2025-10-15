import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrgEntity } from './organization.entity';
import { RoleEntity } from './role.entity';

export interface UserData {
  [x: string]: any;
  referredId: number;
  referredRole: number;
  businessName: string;
  parent_id: number;
  isActive: boolean;
}

@Entity('user')
export class UserEntity extends BaseEntity {
  @ApiProperty({
    type: String,
    example: 'user-uuid',
  })
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @ApiProperty({
    type: Number,
    description: 'Ref of userId ',
  })
  @Column({
    type: Number,
    name: 'ref_userId',
    nullable: false,
  })
  ref_userId: number;

  @ApiProperty({
    type: String,
    example: 'John',
  })
  @Column({
    type: 'varchar',
    name: 'first_name',
    nullable: false,
  })
  firstName: string;

  @ApiProperty({
    type: String,
    example: 'Doe',
  })
  @Column({
    type: 'varchar',
    name: 'last_name',
    nullable: false,
  })
  lastName: string;

  @ApiProperty({
    type: String,
    example: 'johndoe@gmail.com',
  })
  @Column({
    type: 'varchar',
    name: 'email',
    nullable: false,
    unique: false,
  })
  email: string;

  @ApiProperty({
    type: String,
    example: 'hasdedPassword',
  })
  @Column({ type: 'varchar', name: 'password', nullable: true })
  password: string;

  @ApiProperty({
    type: String,
    example: 'johndoe123',
  })
  @Column({ type: 'varchar', name: 'username', nullable: true })
  username: string;

  @ApiProperty({
    type: String,
    example: '91234567890',
  })
  @Column({ type: 'varchar', name: 'phone_number', nullable: true })
  phoneNumber: string;

  @ApiProperty({
    type: String,
    example: 'https://example.com/johndoe.jpg',
  })
  @Column({ type: 'varchar', name: 'profile_pic', nullable: true })
  profilePic: string;

  @ApiProperty({
    type: String,
    example: 'Address',
  })
  @Column({ type: 'varchar', name: 'address', nullable: true })
  address: string;

  @ApiProperty({
    type: String,
    example: 'Koplhapur',
  })
  @Column({ type: 'varchar', name: 'city', nullable: true })
  city: string;

  @ApiProperty({
    type: String,
    example: 'India',
  })
  @Column({ type: 'varchar', name: 'country', nullable: true })
  country: string;

  @Column({ type: 'varchar', name: 'businessName', nullable: true })
  businessName: string;

  @ApiProperty({
    type: String,
    description: 'User Active Status',
    example: '1 || 2',
  })
  @Column({ type: 'varchar', name: 'isactive', nullable: true })
  isActive: string;

  @ApiProperty({
    type: String,
    description: 'User isOnline Status',
    example: '1 || 2',
  })
  @Column({ type: 'integer', name: 'isonline', nullable: true })
  isOnline: number;

  //MAny To One
  @ApiProperty({
    type: String,
    description: 'Organization Id',
  })
  @ManyToOne(() => OrgEntity, (org) => org.org_id)
  @JoinColumn({ name: 'org_id' })
  // @Column({ type: 'varchar', name: 'org_id', nullable: true })
  org_id: OrgEntity;

  @ApiProperty({ type: Number, description: 'Role Id' })
  @ManyToOne(() => RoleEntity, (role) => role.role_id)
  @JoinColumn({ name: 'role' })
  role: RoleEntity;

  @ApiProperty({
    type: Number,
    description: 'Refresh Token',
  })
  @Column({
    type: 'int',
    name: 'parent_id',
    nullable: true,
  })
  parent_id: number;

  @ApiProperty({
    type: String,
    description: 'Refresh Token',
  })
  @Column({
    type: 'text',
    name: 'refresh_token',
    nullable: true,
  })
  refreshToken: string;

  @ApiProperty({
    type: String,
    description: 'Reset Token',
  })
  @Column({
    type: 'text',
    name: 'reset_token',
    nullable: true,
  })
  resetToken: string;

  @ApiProperty({
    type: String,
    description: 'fcm_token',
  })
  @Column({ type: String, name: 'fcm_token', nullable: true })
  fcmToken: string;

  @ApiProperty({
    type: String,
    description: 'Last Login At',
  })
  @Column({
    name: 'last_login_at',
    type: 'timestamp',
    nullable: true,
    default: null,
  })
  public lastLoginAt: Date | null;

  /*
   * Create and Update Date Columns
   */
  @ApiProperty({
    type: String,
    description: 'Created At',
  })
  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  public createdAt!: Date;

  @ApiProperty({
    type: String,
    description: 'Updated At',
  })
  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  public updatedAt!: Date;

  @ApiProperty({
    type: String,
    description: 'Deleted At',
  })
  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at' })
  public deletedAt!: Date;

  //Custom User-DATA
  @Column('jsonb', { nullable: true })
  userData: UserData[];
}
