import { ApiProperty } from '@nestjs/swagger';

export class NdaDto {
  @ApiProperty() public readonly name!: string;
}
