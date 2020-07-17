import { ApiProperty } from '@nestjs/swagger';
export class VacationTypeDto {
  @ApiProperty() public readonly vacationType!: string;
}
