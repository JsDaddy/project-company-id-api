import { ApiProperty } from '@nestjs/swagger';
export class TechnologyDto {
  @ApiProperty() public readonly name!: string;
  @ApiProperty() public readonly _id?: string;
}
