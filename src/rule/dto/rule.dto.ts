import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty() public readonly title!: string;
  @ApiProperty() public readonly desc!: string;
}
