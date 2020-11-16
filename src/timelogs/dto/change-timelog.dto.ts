import { ApiPropertyOptional } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class ChangeTimelogDto {
  @ApiPropertyOptional() public readonly desc!: string;
  @ApiPropertyOptional() public readonly project!: Types.ObjectId;
  @ApiPropertyOptional() public readonly time!: string;
  @ApiPropertyOptional() public readonly date!: string | Date;
}
