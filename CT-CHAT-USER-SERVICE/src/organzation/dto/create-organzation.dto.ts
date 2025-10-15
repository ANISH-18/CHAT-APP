import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateOrganzationDto {
  @ApiProperty({
    type: String,
    name: 'org_name',
    description: 'Organization Name',
  })
  @IsNotEmpty({ message: 'Organization Name is required' })
  org_name: string;

  @ApiProperty({
    type: String,
    name: 'email',
    description: 'Organization Email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    name: 'website',
    description: 'Organization Website',
  })
  @IsNotEmpty({ message: 'Website is required' })
  website: string;

  @ApiProperty({
    type: String,
    name: 'logo',
    description: 'Organization Logo',
  })
  @IsNotEmpty({ message: 'Logo is required' })
  logo: string;
}
