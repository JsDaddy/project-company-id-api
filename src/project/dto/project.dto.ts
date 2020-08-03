import { ApiProperty } from '@nestjs/swagger';

export class ProjectDto {
  @ApiProperty() public readonly _id?: string;
  @ApiProperty() public readonly customer!: string;
  @ApiProperty() public readonly industry!: string;
  @ApiProperty() public readonly isActivity!: boolean;
  @ApiProperty() public readonly isInternal!: boolean;
  @ApiProperty() public readonly isRejected!: boolean;
  @ApiProperty() public readonly methodology!: string;
  @ApiProperty() public readonly name!: string;
  @ApiProperty() public readonly nda!: string;
  @ApiProperty() public readonly services!: string;
  @ApiProperty() public readonly stack!: string;
  @ApiProperty() public readonly startDate!: Date;
  @ApiProperty() public readonly types!: string;
}
