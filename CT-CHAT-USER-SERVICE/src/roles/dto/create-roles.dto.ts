import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateRolesDto {
  @ApiProperty({
    type: String,
    name: 'role_name',
    description: 'Add Role Name',
  })
  @IsNotEmpty({ message: 'Role Name is required' })
  role_name: string[];
}
