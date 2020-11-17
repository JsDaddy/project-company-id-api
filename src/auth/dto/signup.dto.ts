import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class SignUpDto {
  @ApiProperty() public readonly name!: string;
  @ApiProperty() public readonly lastName!: string;
  @ApiProperty() public readonly avatar!: string;
  @ApiProperty() public readonly dob!: Date;
  @ApiProperty() public readonly email!: string;
  @ApiProperty() public readonly password!: string;
  @ApiProperty() public readonly englishLevel!: string;
  @ApiProperty() public readonly github!: string;
  @ApiProperty() public readonly phone!: string;
  @ApiProperty() public readonly position!: string;
  @ApiProperty() public readonly role!: string;
  @ApiProperty() public readonly skype!: string;
  @ApiPropertyOptional() public readonly slack!: string;
}
