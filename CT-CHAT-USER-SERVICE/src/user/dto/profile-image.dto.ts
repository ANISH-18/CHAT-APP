import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateProfilePicDto {
  @IsNotEmpty()
  @IsString()
  profilePic: string;

  @IsNotEmpty()
  // @IsInt()
  ref_userId: number;

  // @IsNotEmpty()
  @IsOptional()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  // @IsInt()
  role: number;
}
