import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class UserProfileDto {
  @IsNotEmpty()
  @IsString()
  user_id: string;
}
