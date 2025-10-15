import { UserData } from '@database';
import { IsEmail, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  ref_userId: number;

  // @IsNotEmpty()
  // parent_id: number;

  // @IsNotEmpty()
  @IsOptional()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  role: number;

  @IsOptional()
  firstName: string;

  @IsOptional()
  lastName: string;

  @IsOptional()
  phoneNumber: string;

  @IsOptional()
  address: string;

  @IsOptional()
  fcmToken: string;

  @IsOptional()
  userData1: any;

  @IsOptional()
  @IsEmail()
  emailToUpdate: string;

  @IsOptional()
  isOnline: number;
}
