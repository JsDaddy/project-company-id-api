import { ApiProperty } from '@nestjs/swagger';
export class StackDto {
  @ApiProperty() public readonly name!: string;
  @ApiProperty() public readonly _id?: string;
}
