import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

enum ConversationType {
  OneToOne = 1,
  Group = 2,
}

export class CreateConvDto {
  @ApiProperty({
    title: 'Conversation Type',
    description: 'Conversation of type one to one or group',
  })
  @IsNotEmpty()
  type: ConversationType;

  @ApiProperty({ title: 'Participants', description: 'Participants List' })
  @IsNotEmpty()
  participants: string[];
}
