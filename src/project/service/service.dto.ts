import { ApiProperty } from '@nestjs/swagger';

export class serviceDto {
  @ApiProperty() public readonly name!: string;
}
