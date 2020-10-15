import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export enum VacationType {
  VacationPaid,
  VacationNonPaid,
  SickPaid,
  SicktNonPaid,
}

export enum LogType {
  All = 'all',
  Timelogs = 'timelogs',
  Vacations = 'vacations',
  Holidays = 'holidays',
}

export class FilterLogDto {
  @ApiProperty() public readonly first!: string;
  @ApiPropertyOptional() public readonly uid?: string;
  @ApiPropertyOptional() public readonly project?: string;
  @ApiPropertyOptional({ enum: VacationType })
  public readonly type?: VacationType;
  @ApiProperty({ enum: LogType }) public readonly logType?: LogType;
}
