import { ApiProperty } from '@nestjs/swagger';

export class FilterTimelogDto {
  @ApiProperty() public readonly first!: string;
  @ApiProperty() public readonly uid!: string;
}
