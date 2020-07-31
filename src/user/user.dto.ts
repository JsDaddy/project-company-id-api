import { ApiProperty } from '@nestjs/swagger';
export class UserDto {
  @ApiProperty() public readonly name?: string;
  @ApiProperty() public readonly secondName?: string;
  @ApiProperty() public readonly avatar?: string;
  @ApiProperty() public readonly initialLogin!: boolean;
  @ApiProperty() public readonly dob?: Date;
  @ApiProperty() public readonly email!: string;
  @ApiProperty() public readonly password!: string;
  @ApiProperty() public readonly accessToken?: string;
  @ApiProperty() public readonly englishLevel?: string;
  @ApiProperty() public readonly github?: string;
  @ApiProperty() public readonly phone?: string;
  @ApiProperty() public readonly position?: string;
  @ApiProperty() public readonly role?: string;
  @ApiProperty() public readonly skype?: string;
  @ApiProperty() public readonly activeProjects?: string[];
}
