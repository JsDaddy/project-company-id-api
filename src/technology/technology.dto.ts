import { ApiProperty } from '@nestjs/swagger';
export class TechnologyDto {
  @ApiProperty() public readonly name!: string;
}
