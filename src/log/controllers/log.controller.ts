import { FilterLogDto } from './../dto/filter-log.dto';
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
  Query,
  // Req,
} from '@nestjs/common';
import { CreateTimelogDto } from '../dto/create-timelog.dto';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { LogService } from '../services/log.service';

@ApiTags('logs')
@Controller('logs')
export class LogController {
  public constructor(private readonly _timelogService: LogService) {}

  @ApiOperation({
    summary: 'Find all logs.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Logs found successfully',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Logs not found',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  public async findLogs(
    @Res() res: Response,
    @Query() query: FilterLogDto,
  ): Promise<Response> {
    try {
      const timelogs = await this._timelogService.findLogs(query);
      return res.status(HttpStatus.OK).json({ data: timelogs, error: null });
    } catch (error) {
      console.log(error);
      return res.status(HttpStatus.NOT_FOUND).json({ data: null, error });
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
    @Query('first') first: string,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const timelogs = await this._timelogService.findUserLogs(userId, first);
      return res.status(HttpStatus.OK).json({ data: timelogs, error: null });
    } catch (error) {
      console.log(error);
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
      await this._timelogService.createTimelog(timelog);
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
