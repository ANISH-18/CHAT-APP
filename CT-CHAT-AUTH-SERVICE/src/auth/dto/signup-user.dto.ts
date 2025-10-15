import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignUpUserDto {
  @IsNotEmpty({ message: 'User_id Is Required' })
  user_id: string;

  @IsNotEmpty({ message: 'Email Is Required' })
  @IsEmail({}, { message: 'EMail must be valid email address' })
  email: string;

  @IsNotEmpty({ message: 'Password is requried' })
  password: string;

  @IsNotEmpty({ message: 'Last Name Is Required' })
  username: string;
}
