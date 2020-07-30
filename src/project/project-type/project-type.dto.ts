import { ApiProperty } from '@nestjs/swagger';

export class ProjectTypeDto {
  @ApiProperty() public readonly name!: string;
}
