import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty() public readonly customer!: string;
  @ApiProperty() public readonly industry!: string;
  @ApiProperty() public readonly isInternal!: boolean;
  @ApiProperty() public readonly isActivity!: boolean;
  @ApiProperty() public readonly name!: string;
  @ApiProperty() public readonly stack!: string[];
  @ApiProperty() public readonly startDate!: Date;
  @ApiProperty() public readonly isPortfolio!: boolean;
  @ApiPropertyOptional() public readonly users?: string[];
  @ApiPropertyOptional() public readonly images?: string[];
  @ApiPropertyOptional() public readonly description?: string;
  @ApiPropertyOptional() public readonly feedback?: string;
}
