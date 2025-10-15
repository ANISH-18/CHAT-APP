import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';

class SingleMarkAsViewedDto {
  @IsString()
  messageId: string;
}

export class MarkAsViewedDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SingleMarkAsViewedDto)
  messages: SingleMarkAsViewedDto[];
}
