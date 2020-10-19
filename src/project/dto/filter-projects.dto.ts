import { ProjectStatus } from './../enums/project-status.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ProjectFilterDto {
  @ApiPropertyOptional() public readonly uid?: string;
  @ApiPropertyOptional() public readonly onGoing?: string;
  @ApiPropertyOptional() public readonly isInternal?: string;
  @ApiPropertyOptional() public readonly status?: ProjectStatus;
  @ApiPropertyOptional() public readonly stack?: string;
}
