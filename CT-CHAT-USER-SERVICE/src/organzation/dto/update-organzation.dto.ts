import { PartialType } from '@nestjs/swagger';
import { CreateOrganzationDto } from './create-organzation.dto';

export class UpdateOrganzationDto extends PartialType(CreateOrganzationDto) {}
