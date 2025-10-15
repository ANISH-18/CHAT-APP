import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('organization')
export class OrgEntity extends BaseEntity {
  @ApiProperty({
    type: Number,
    example: 'org-id',
  })
  @PrimaryGeneratedColumn()
  org_id: number;

  @ApiProperty({
    type: String,
    example: 'org-name',
  })
  @Column({
    type: 'varchar',
    name: 'org_name',
    nullable: false,
  })
  org_name: string;

  @ApiProperty({
    type: String,
    example: 'johndoe@gmail.com',
  })
  @Column({
    type: 'varchar',
    name: 'email',
    nullable: false,
    unique: true,
  })
  email: string;

  @ApiProperty({
    type: String,
    example: 'website url',
  })
  @Column({
    type: 'varchar',
    name: 'website',
    nullable: true,
  })
  website: string;

  @ApiProperty({
    type: String,
    example: 'logo url',
  })
  @Column({
    type: 'varchar',
    name: 'logo',
    nullable: true,
  })
  logo: string;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  @Column({
    type: 'int',
    name: 'isactive',
    nullable: true,
  })
  isActive: number;

  //Reference of User_Id the User who register the org
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
