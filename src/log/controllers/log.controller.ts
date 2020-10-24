import { FilterLogDto, LogType } from './../dto/filter-log.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  Controller,
  HttpStatus,
  Get,
  Res,
  // Param,
  UseGuards,
  Query,
  Param,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { LogService } from '../services/log.service';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Positions } from 'src/auth/enums/positions.enum';

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
  @UseGuards(
    AuthGuard('jwt'),
    new RolesGuard({ [Positions.OWNER]: [], [Positions.DEVELOPER]: ['uid'] }),
  )
  @Get(':first/:logType')
  public async findLogs(
    @Res() res: Response,
    @Param('first') first: string,
    @Param('logType') logType: LogType,
    @Query() query: FilterLogDto,
  ): Promise<Response> {
    try {
      const params: FilterLogDto = { ...query, logType, first };
      const logs = await this._logService.findLogs(params);
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
  @UseGuards(
    AuthGuard('jwt'),
    new RolesGuard({ [Positions.OWNER]: [], [Positions.DEVELOPER]: ['uid'] }),
  )
  @Get('solo/:first/:logType')
  public async findLogsByDate(
    @Res() res: Response,
    @Param('first') first: string,
    @Param('logType') logType: LogType,
    @Query() query: FilterLogDto,
  ): Promise<Response> {
    try {
      const params: FilterLogDto = { ...query, first, logType };
      const logs: any = await this._logService.findLogByDate(params);
      return res.status(HttpStatus.OK).json({ data: logs, error: null });
    } catch (error) {
      return res.status(HttpStatus.NOT_FOUND).json({ data: null, error });
    }
  }
}
