import { IsEmail, IsNotEmpty } from 'class-validator';

export class GetNotification {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  role: number;
}
