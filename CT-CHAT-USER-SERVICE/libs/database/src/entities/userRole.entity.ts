import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { RoleEntity } from './role.entity';
import { OrgEntity } from './organization.entity';

@Entity('userRoles')
export class UserRoleEntity extends BaseEntity {
  @ApiProperty({
    type: String,
    example: 'userRole-id',
  })
  @PrimaryGeneratedColumn()
  userRoleId: number;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  @ManyToOne(() => OrgEntity, (org) => org.org_id)
  @JoinColumn({ name: 'org_id' })
  org_id: number;

  //ManyTOOne Changes
  @ApiProperty({
    type: String,
    example: 'user-uuid',
  })
  @ManyToOne(() => UserEntity, (user) => user.user_id)
  @JoinColumn({ name: 'user_id' })
  user_id: UserEntity;

  @ApiProperty({
    type: String,
    example: 'role-uuid',
  })
  @ManyToOne(() => RoleEntity, { eager: true }) // Assuming UserRoleEntity is the related entity
  @JoinColumn({ name: 'role', referencedColumnName: 'role_id' }) // Adjust referencedColumnName based on the primary key of UserRoleEntity
  role: RoleEntity;

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
}
