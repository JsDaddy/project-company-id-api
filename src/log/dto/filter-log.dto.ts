import { ApiPropertyOptional } from '@nestjs/swagger';
export enum VacationType {
  VacationPaid = 0,
  VacationNonPaid = 1,
  SickPaid = 2,
  SickNonPaid = 3,
}

export enum LogType {
  All = 'all',
  Timelogs = 'timelogs',
  Vacations = 'vacations',
  Holidays = 'holidays',
}

export class FilterLogDto {
  @ApiPropertyOptional() public readonly first!: string;
  @ApiPropertyOptional() public readonly uid?: string;
  @ApiPropertyOptional() public readonly project?: string;
  @ApiPropertyOptional({ enum: VacationType })
  public readonly type?: VacationType;
  @ApiPropertyOptional({ enum: LogType }) public readonly logType?: LogType;
}
