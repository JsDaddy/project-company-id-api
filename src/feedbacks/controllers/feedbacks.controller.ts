import { IFeedback } from './../interfaces/feedbacks.interface';
import { Controller, HttpStatus, Get, Res, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { FeedbacksService } from '../services/feedbacks.service';

@ApiTags('feedbacks')
@Controller('feedbacks')
export class FeedbacksController {
  public constructor(private readonly _feedbacksService: FeedbacksService) {}

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  @ApiOperation({
    summary: 'Find feedbacks.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Found feedbacks',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'feedbacks not found',
  })
  @Get(':feedback')
  public async findFacility(
    @Res() res: Response,
    @Param('feedback') name: string,
  ): Promise<Response> {
    try {
      const feedback: IFeedback | null = await this._feedbacksService.findFeedback(
        name,
      );
      if (!feedback) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ data: null, error: 'feedback not found' });
      }
      return res.status(HttpStatus.OK).json({ data: feedback, error: null });
    } catch (e) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ data: null, e });
    }
  }
}
