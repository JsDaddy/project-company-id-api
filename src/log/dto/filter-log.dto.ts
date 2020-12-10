import { ApiPropertyOptional } from '@nestjs/swagger';
export enum VacationType {
  VacationNonPaid,
  VacationPaid,
  SickNonPaid,
  SickPaid,
}

export enum LogType {
  All = 'all',
  Timelogs = 'timelogs',
  Vacations = 'vacations',
  Holidays = 'holidays',
  Birthdays = 'birthdays',
}

export class FilterLogDto {
  @ApiPropertyOptional() public readonly first!: Date;
  @ApiPropertyOptional() public readonly uid?: string;
  @ApiPropertyOptional() public readonly project?: string;
  @ApiPropertyOptional({ enum: VacationType })
  public readonly type?: VacationType;
  @ApiPropertyOptional({ enum: LogType }) public readonly logType?: LogType;
}
