import { PAGINATION } from '@helpers/constants';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';

export class GetProbizcaUser {
  @ApiProperty({
    type: Number,
    name: 'role_id',
    description: 'Add Role id',
  })
  @IsNotEmpty({ message: 'Role id is required' })
  role_id: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = PAGINATION.PAGE_NUMBER;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(5)
  recordsPerPage: number = PAGINATION.RECORDS_PER_PAGE;

  @IsOptional()
  showAll: string;

  @IsOptional()
  search: string;

  @IsOptional()
  format: number;
}
