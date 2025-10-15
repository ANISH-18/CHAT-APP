import { IsOptional } from 'class-validator';

export class FindRoomDto {
  @IsOptional()
  getRole: number;

  @IsOptional()
  search: string;

  @IsOptional()
  page: number;

  @IsOptional()
  recordsPerPage: number;
}
