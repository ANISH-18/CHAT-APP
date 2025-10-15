import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignInUserDto {
  @ApiProperty({
    type: String,
    description: 'Email Address',
    example: 'abc@gmail.com',
  })
  @IsNotEmpty({ message: 'Email Is Required' })
  @IsEmail({}, { message: 'EMail must be valid email address' })
  email: string;

  @ApiProperty({
    type: String,
    description: 'Password',
    example: 'hasdedPassword',
  })
  @IsNotEmpty({ message: 'Password is requried' })
  password: string;
}
