import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUserRoleDto {
  @ApiProperty({
    type: Number,
    name: 'role_id',
    description: 'Add Role id',
  })
  @IsNotEmpty({ message: 'Role id is required' })
  role: number;

  @ApiProperty({
    type: String,
    name: 'user_id',
    description: 'Add User id',
  })
  @IsNotEmpty({ message: 'User id is required' })
  user_id: string;

  @ApiProperty({
    type: Number,
    name: 'org_id',
    description: 'Add Org id',
  })
  @IsNotEmpty({ message: 'Org id is required' })
  org_id: number;
}
