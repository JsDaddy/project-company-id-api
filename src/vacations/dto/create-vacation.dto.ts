import { ApiProperty } from '@nestjs/swagger';

export enum VacationType {
  VacationNonPaid = 0,
  VacationPaid = 1,
  SickNonPaid = 2,
  SickPaid = 3,
}

export class CreateVacationDto {
  @ApiProperty() public readonly date!: Date;
  @ApiProperty() public readonly desc!: string;
  @ApiProperty({ enum: VacationType })
  public readonly type!: VacationType;
}
