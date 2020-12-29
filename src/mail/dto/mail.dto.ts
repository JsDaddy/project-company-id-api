import { ApiProperty } from '@nestjs/swagger';

export class CreateMailDto {
  @ApiProperty() public readonly name!: string;
  @ApiProperty() public readonly email!: string;
  @ApiProperty() public readonly message!: string;
}
