import { IsOptional } from 'class-validator';

export class RoomUpdateReceiptDto {
  // @IsOptional()
  // message_id: string;

  @IsOptional()
  conversation_id: string;

  @IsOptional()
  uniqueId: string;

  @IsOptional()
  receiver_id: string;

  @IsOptional()
  status: number;
}
