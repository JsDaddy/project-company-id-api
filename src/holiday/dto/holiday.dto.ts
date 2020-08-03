import { ApiProperty } from '@nestjs/swagger';

export class HolidayDto {
  @ApiProperty() public readonly _id?: string;
  @ApiProperty() public readonly name!: string;
  @ApiProperty() public readonly date!: Date;
}
