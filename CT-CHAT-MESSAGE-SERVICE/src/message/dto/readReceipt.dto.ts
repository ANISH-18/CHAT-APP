import { IsNotEmpty, IsOptional } from 'class-validator';

export class ReadReceiptDto {
  @IsNotEmpty()
  conversation_id: string;

  @IsOptional()
  receiver_id?: string;
}
