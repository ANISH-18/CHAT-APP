import { ParseIntPipe } from '@nestjs/common';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class AuthorizeRequestDto {
  @IsString()
  response_type: string;

  @IsString()
  client_id: string;

  @IsString()
  client_secret_key: string;

  @IsString()
  email: string;

  @IsString()
  redirect_uri: string;

  @IsString()
  state: string;

  @IsString() // Change to IsString, as role will be parsed later
  role: string;

  @IsOptional()
  parent_id: number;

  @IsOptional()
  conversationId: string;

  @IsOptional()
  authorRole: string;
}
