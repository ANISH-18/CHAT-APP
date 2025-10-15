import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RoomDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'Room ID',
    example: 'room-uuid',
  })
  room_id: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Page',
    example: 1,
  })
  page: number;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Page Size',
    example: 10,
  })
  pageSize: number;
}
