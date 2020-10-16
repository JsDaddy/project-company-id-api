import { ApiProperty } from '@nestjs/swagger';
export enum StatusType {
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PENDING = 'pending',
}

export class ChangeStatusDto {
  @ApiProperty({ enum: StatusType })
  public readonly status!: StatusType;
}
