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
import { OrgEntity } from './organization.entity';

@Entity('roles')
export class RoleEntity extends BaseEntity {
  @ApiProperty({
    type: String,
    example: 'role_id',
  })
  @PrimaryGeneratedColumn()
  role_id: number;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  @Column({
    type: 'int',
    name: 'parent_id',
    nullable: false,
  })
  parent_id: number;

  @ApiProperty({
    type: String,
    example: 'admin',
  })
  @Column({
    type: 'varchar',
    name: 'role_name',
    nullable: false,
  })
  role_name: string;

  @ApiProperty({
    type: String,
    example: 'org-uuid',
  })
  @ManyToOne(() => OrgEntity, (org) => org.org_id)
  @JoinColumn({ name: 'org_id' })
  // @Column({
  //   type: 'varchar',
  //   name: 'org_id',
  //   nullable: true,
  // })
  org_id: OrgEntity;

  //Reference of User_Id the User who creates the role
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
