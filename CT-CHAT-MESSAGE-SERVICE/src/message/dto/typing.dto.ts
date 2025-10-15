import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class TypingDto {
  @ApiProperty({ description: 'Receiver ID', example: 'user-uuid' })
  @IsNotEmpty()
  receiver_id: string;

  @ApiProperty({ description: 'isTyping', example: 'True || False' })
  @IsNotEmpty()
  isTyping: boolean;
}
