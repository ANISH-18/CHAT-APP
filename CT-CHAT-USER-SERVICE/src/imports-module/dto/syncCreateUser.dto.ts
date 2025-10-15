import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class SyncCreateUserDto {
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
  @IsOptional({ message: 'Profile Picture is requried' })
  profilePic: string;

  @ApiProperty({
    type: String,
    description: 'Address',
  })
  @IsOptional({ message: 'Adrress is requried' })
  address: string;

  @ApiProperty({
    type: String,
    description: 'Organization',
    example: 'onpoint',
  })
  @IsOptional({ message: 'Organization is requried' })
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
    description: 'Parent Id',
    example: '2',
  })
  @IsOptional({ message: 'Parent is requried' })
  parent_id: number;

  @ApiProperty({
    type: String,
    description: 'ref_userId',
    example: 'onpoint',
  })
  @IsNotEmpty({ message: 'Ref userId' })
  ref_userId: number;

  @ApiProperty({
    type: Object,
    description: 'User Active Status',
    example: '1 || 2',
  })
  @IsOptional()
  userData1: any;

  @IsOptional()
  businessName: string;
}
