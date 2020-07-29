import { ApiProperty } from '@nestjs/swagger';

export class ServiceDto {
  @ApiProperty() public readonly name!: string;
}
