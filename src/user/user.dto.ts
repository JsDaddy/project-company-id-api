import { ApiProperty } from '@nestjs/swagger';
export class UserDto {
  @ApiProperty() public readonly email!: string;
  @ApiProperty() public readonly username!: string;
}
