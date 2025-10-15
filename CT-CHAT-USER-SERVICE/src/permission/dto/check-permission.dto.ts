import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CheckPermissionDto {
  @ApiProperty({
    type: Number,
    required: true,
    name: 'role_A',
  })
  @IsNotEmpty({ message: 'Role A is Required' })
  role_A: number;

  @ApiProperty({
    type: Number,
    required: true,
    name: 'role_B',
  })
  @IsNotEmpty({ message: 'Role B is Required' })
  role_B: number;
}
