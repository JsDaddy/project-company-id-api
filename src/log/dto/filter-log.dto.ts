import { ApiProperty } from '@nestjs/swagger';

export class FilterLogDto {
  @ApiProperty() public readonly first!: string;
  @ApiProperty() public readonly uid?: string;
  @ApiProperty() public readonly project?: string;
  @ApiProperty() public readonly type?: string;
  @ApiProperty() public readonly logType!: string;
}
