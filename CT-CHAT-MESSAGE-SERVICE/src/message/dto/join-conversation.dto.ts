import { IsOptional } from 'class-validator';

export class JoinAllConversationDto {
  @IsOptional()
  receiver_id: string;

  @IsOptional()
  page: number;

  @IsOptional()
  pageSize: number;
}
