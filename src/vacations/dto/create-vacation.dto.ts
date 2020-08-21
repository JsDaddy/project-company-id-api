import { ApiProperty } from '@nestjs/swagger';
export class CreateVacationDto {
  @ApiProperty() public readonly _id?: string;
  @ApiProperty() public readonly date!: Date;
  @ApiProperty() public readonly desc!: string;
  @ApiProperty() public readonly type!: string;
}
