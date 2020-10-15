import { FilterLogDto } from './../dto/filter-log.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  Controller,
  HttpStatus,
  Get,
  Res,
  // Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { LogService } from '../services/log.service';

@ApiTags('logs')
@Controller('logs')
export class LogController {
  public constructor(private readonly _logService: LogService) {}

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
      const logs = await this._logService.findLogs(query);
      return res.status(HttpStatus.OK).json({ data: logs, error: null });
    } catch (error) {
      return res.status(HttpStatus.NOT_FOUND).json({ data: null, error });
    }
  }

  @ApiOperation({
    summary: 'Find all logs for one day.',
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
  @Get('date')
  public async findLogsByDate(
    @Res() res: Response,
    @Query() query: FilterLogDto,
  ): Promise<Response> {
    try {
      const logs: any = await this._logService.findLogByDate(query);
      return res.status(HttpStatus.OK).json({ data: logs, error: null });
    } catch (error) {
      console.log(error);
      return res.status(HttpStatus.NOT_FOUND).json({ data: null, error });
    }
  }
  // @ApiOperation({
  //   summary: 'Find timelogs by uid',
  // })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'Found timelogs',
  // })
  // @ApiResponse({
  //   status: HttpStatus.NOT_FOUND,
  //   description: 'Record not found',
  // })
  // @UseGuards(AuthGuard('jwt'))
  // @Get(':user')
  // public async findByUser(
  //   @Param('user') userId: string,
  //   @Query('first') first: string,
  //   @Res() res: Response,
  // ): Promise<Response> {
  //   try {
  //     const timelogs: Partial<ITimelog[] = await this._timelogService.findUserLogs(userId, first);
  //     return res.status(HttpStatus.OK).json({ data: timelogs, error: null });
  //   } catch (error) {
  //     console.log(error);
  //     return res
  //       .status(HttpStatus.INTERNAL_SERVER_ERROR)
  //       .json({ data: null, error });
  //   }
  // }
}
