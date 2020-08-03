import { ApiProperty } from '@nestjs/swagger';

export class ProjectDto {
  @ApiProperty() public readonly title!: string;
  @ApiProperty() public readonly desc!: string;
}
