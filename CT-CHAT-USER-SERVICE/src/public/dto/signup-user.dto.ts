import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignupUserDto {
  @ApiProperty({
    type: String,
    description: 'First Name',
    example: 'John',
  })
  @IsNotEmpty({ message: 'First Name Is Required' })
  firstName: string;

  @ApiProperty({
    type: String,
    description: 'Last Name',
    example: 'Doe',
  })
  @IsNotEmpty({ message: 'Last Name Is Required' })
  lastName: string;

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

  @ApiProperty({
    type: String,
    description: 'Username',
    example: 'johndoe',
  })
  @IsNotEmpty({ message: 'Username is requried' })
  username: string;

  @ApiProperty({
    type: String,
    description: 'Phone Number',
    example: '91234567890',
  })
  @IsNotEmpty({ message: 'Phone Number is requried' })
  phoneNumber: string;

  @ApiProperty({
    type: String,
    description: 'Profile Picture',
    example: 'https://example.com/johndoe.jpg',
  })
  @IsNotEmpty({ message: 'Profile Picture is requried' })
  profilePic: string;

  @ApiProperty({
    type: String,
    description: 'Address',
  })
  @IsNotEmpty({ message: 'Adrress is requried' })
  address: string;

  @ApiProperty({
    type: String,
    description: 'City',
    example: 'Kolhapur',
  })
  @IsNotEmpty({ message: 'City is requried' })
  city: string;

  @ApiProperty({
    type: String,
    description: 'Country',
    example: 'India',
  })
  @IsNotEmpty({ message: 'Country is requried' })
  country: string;

  @ApiProperty({
    type: String,
    description: 'Organization',
    example: 'onpoint',
  })
  @IsNotEmpty({ message: 'Organization is requried' })
  org_id: string;

  @ApiProperty({
    type: String,
    description: 'Organization',
    example: 'onpoint',
  })
  @IsNotEmpty({ message: 'Role is requried' })
  role: number;

  @ApiProperty({
    type: String,
    description: 'ref_userId',
    example: 'onpoint',
  })
  @IsNotEmpty({ message: 'Ref userId' })
  ref_userId: number;
}
