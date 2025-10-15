import { IsOptional } from 'class-validator';

export class UpdateReceiptDto {
  // @IsOptional()
  // message_id: string;

  // @IsOptional()
  // conversation_id: string;

  @IsOptional()
  uniqueId: string;

  @IsOptional()
  sender_id: string;

  @IsOptional()
  status: number;
}
