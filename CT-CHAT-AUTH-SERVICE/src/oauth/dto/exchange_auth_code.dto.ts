import { IsNotEmpty } from 'class-validator';

export class ExchangeAuthCode {
  @IsNotEmpty()
  authorization_code: string;

  @IsNotEmpty()
  state: string;

  @IsNotEmpty()
  user_id: string;
}
