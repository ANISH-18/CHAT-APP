import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CheckUserRoleDto {
  @ApiProperty({
    type: String,
    name: 'user_id',
    description: 'Add User id',
  })
  @IsNotEmpty({ message: 'UserId is required' })
  @IsUUID('4', { message: 'Invalid UUID format for user_id' })
  userId: string;
}
