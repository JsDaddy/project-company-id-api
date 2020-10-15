import { ApiPropertyOptional } from '@nestjs/swagger';

export class ProjectFilterDto {
  @ApiPropertyOptional() public readonly uid?: string;
  @ApiPropertyOptional() public readonly isActivity?: string;
  @ApiPropertyOptional() public readonly isInternal?: string;
  @ApiPropertyOptional() public readonly stack?: string;
}
