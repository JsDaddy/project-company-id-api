import { IStack } from './../interfaces/stack.interface';
import { StackService } from './../services/stack.service';
import { Controller, HttpStatus, Get, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('stack')
@Controller('stack')
export class StackController {
  public constructor(private readonly _stackService: StackService) {}
  @ApiOperation({
    summary: 'Find stack.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Found stack',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Record not found',
  })
  @Get('')
  public async findStack(@Res() res: Response): Promise<Response> {
    try {
      const stack: IStack[] = await this._stackService.findStack();
      return res.status(HttpStatus.OK).json({ data: stack, error: null });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ data: null, error });
    }
  }
}
