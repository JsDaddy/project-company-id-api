import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class CreateTimelogDto {
  @ApiProperty() public readonly desc!: string;
  @ApiProperty() public readonly date!: string;
  @ApiProperty() public readonly time!: string;
}
