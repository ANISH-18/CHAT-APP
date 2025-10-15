import { IsNotEmpty } from 'class-validator';

export class DeleteUserDto {
  @IsNotEmpty({
    message: 'User Id Is Required',
  })
  ref_userId: number;

  @IsNotEmpty({
    message: 'Parent Id Is Required',
  })
  parent_id: number;

  @IsNotEmpty({
    message: 'Role Id Is Required',
  })
  role: number;
}
