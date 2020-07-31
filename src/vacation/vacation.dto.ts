import { ApiProperty } from '@nestjs/swagger';
export class VacationDto {
  @ApiProperty() public readonly _id?: string;
  @ApiProperty() public readonly date!: Date;
  @ApiProperty() public readonly desc!: string;
  @ApiProperty() public readonly vacationTypeId!: string;
}
