import { ApiProperty, ApiTags } from '@nestjs/swagger';

import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RoleEntity } from './role.entity';

@ApiTags('Permission')
@Entity('permission')
export class PermissionEntity extends BaseEntity {
  @ApiProperty({
    type: String,
    example: 'permission_id',
  })
  @PrimaryGeneratedColumn()
  permission_id: number;

  //ROLE A
  @ApiProperty({
    type: Number,
    example: 1,
  })
  @ManyToOne(() => RoleEntity, (role) => role.role_id)
  @JoinColumn({ name: 'role_A', referencedColumnName: 'role_id' })
  role_A: RoleEntity[];

  //ROLE B
  @ApiProperty({
    type: 'int',
    example: 'role_B',
  })
  @ManyToOne(() => RoleEntity, (role) => role.role_id)
  @JoinColumn({ name: 'role_B', referencedColumnName: 'role_id' })
  role_B: RoleEntity[];

  @ApiProperty({
    type: 'int',
    example: 'canChat',
  })
  @Column({
    type: 'int',
    name: 'canChat',
    nullable: true,
  })
  canChat: number;

  //Reference of User_Id the User who creates the permission
  @ApiProperty({
    type: String,
    example: 'user-uuid',
  })
  @Column({
    type: 'varchar',
    name: 'createdby',
    nullable: true,
  })
  createdBy: string;

  /*
   * Create and Update Date Columns
   */
  @ApiProperty({
    type: String,
    example: 'created At',
  })
  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  public createdAt!: Date;

  @ApiProperty({
    type: String,
    example: 'updated At',
  })
  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  public updatedAt!: Date;

  @ApiProperty({
    type: String,
    example: 'delete At',
  })
  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at' })
  public deletedAt!: Date;
}
