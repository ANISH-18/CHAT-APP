import { PartialType } from '@nestjs/mapped-types';
import { AuthorizeRequestDto } from './create-oauth.dto';

export class UpdateOauthDto extends PartialType(AuthorizeRequestDto) {}
