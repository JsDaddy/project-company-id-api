import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  Controller,
  HttpStatus,
  Get,
  Res,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { TimelogService } from '../services/timelog.service';
import { CreateTimelogDto } from '../dto/timelog.dto';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('timelog')
@Controller('timelog')
export class TimelogController {
  public constructor(private readonly timelogService: TimelogService) {}

  @ApiOperation({
    summary: 'Find all timelogs.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Timelogs found successfully',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Timelogs not found',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  public async findTimelogs(@Res() res: Response): Promise<Response> {
    try {
      const timelogs = await this.timelogService.findTimelogs();
      return res.status(HttpStatus.OK).json({ data: timelogs, error: null });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ data: null, error });
    }
  }

  @ApiOperation({
    summary: 'Find timelogs by uid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Found timelogs',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Record not found',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get(':user')
  async findByUser(
    @Param('user') userId: string,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const timelogs = this.timelogService.findTimelogsByUser(userId);
      return res.status(HttpStatus.OK).json({ data: timelogs, error: null });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ data: null, error });
    }
  }

  @ApiOperation({
    summary: 'Create new timelog',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Timelog has been created',
  })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createTimelog(
    @Body() timelog: CreateTimelogDto,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      await this.timelogService.createTimelog(timelog);
      return res
        .status(HttpStatus.OK)
        .json({ data: 'Timelog has been created', error: null });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ data: null, error });
    }
  }
}
