import { ApiProperty } from '@nestjs/swagger';

export class CreateTimelogDto {
  @ApiProperty() public readonly desc!: string;
  @ApiProperty() public readonly date!: Date;
  @ApiProperty() public readonly project!: string;
  @ApiProperty() public readonly time!: string;
  @ApiProperty() public readonly user!: string;
}
