import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResetPasswordDto {
  //@IsNotEmpty({message: 'Email Is Required'})
  //@IsEmail({}, {message: 'EMail must be valid email address'})
  //email: string;

  @ApiProperty({
    type: String,
    description: 'password',
    example: 'anc@123qwe',
  })
  @IsNotEmpty({ message: 'Password is requried' })
  password: string;

  @ApiProperty({
    type: String,
    description: 'resetToken',
    example: 'resetToken',
  })
  @IsNotEmpty({ message: 'Reset password token is required' })
  resetToken: string;
}
