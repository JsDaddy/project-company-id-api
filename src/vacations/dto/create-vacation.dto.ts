import { ApiProperty } from '@nestjs/swagger';

export enum VacationType {
  VACPAID,
  VACNONPAID,
  SICKPAID,
  SICKNONPAID,
}

export class CreateVacationDto {
  @ApiProperty() public readonly date!: string;
  @ApiProperty() public readonly desc!: string;
  @ApiProperty({ enum: VacationType })
  public readonly type!: VacationType;
}
