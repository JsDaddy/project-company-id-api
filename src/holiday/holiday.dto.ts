import { ApiProperty } from '@nestjs/swagger';

export class HolidayDto {
  @ApiProperty() public readonly name!: string;
  @ApiProperty() public readonly date!: Date;
}
