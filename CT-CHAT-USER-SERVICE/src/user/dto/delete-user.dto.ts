import { IsEmail, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class DeleteUserDto {
  @IsNotEmpty()
  ref_userId: number;

  @IsOptional()
  @IsEmail()
  email: number;

  @IsNotEmpty()
  role: number;
}
