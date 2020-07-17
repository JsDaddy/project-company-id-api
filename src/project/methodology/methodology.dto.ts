import { ApiProperty } from '@nestjs/swagger';

export class ProjectDto {
  @ApiProperty() public readonly name!: string;
}
