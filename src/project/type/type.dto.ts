import { ApiProperty } from '@nestjs/swagger';

export class TypeDto {
  @ApiProperty() public readonly name!: string;
}
