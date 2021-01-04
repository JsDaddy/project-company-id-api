import { IFeedback } from './../interfaces/feedbacks.interface';
import { Controller, HttpStatus, Get, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { FeedbacksService } from '../services/feedbacks.service';

@ApiTags('feedbacks')
@Controller('feedbacks')
export class FeedbacksController {
  public constructor(private readonly _feedbacksService: FeedbacksService) {}

  @ApiOperation({
    summary: 'Find feedbacks.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Found feedbacks',
  })
  @Get()
  public async findFeedbacks(@Res() res: Response): Promise<Response> {
    try {
      const feedbacks: IFeedback[] = await this._feedbacksService.findFeedbacks();
      return res.status(HttpStatus.OK).json({ data: feedbacks, error: null });
    } catch (e) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ data: null, e });
    }
  }
}
