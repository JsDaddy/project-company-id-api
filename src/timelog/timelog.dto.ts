import { ApiProperty } from '@nestjs/swagger';

export class TimelogDto {
  @ApiProperty() public readonly desc!: string;
  @ApiProperty() public readonly date!: Date;
  @ApiProperty() public readonly project!: string;
  @ApiProperty() public readonly time!: string;
}
