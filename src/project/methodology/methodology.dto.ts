import { ApiProperty } from '@nestjs/swagger';

export class MethodologyDto {
  @ApiProperty() public readonly name!: string;
}
