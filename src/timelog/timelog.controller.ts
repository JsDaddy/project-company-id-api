import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  Controller,
  HttpStatus,
  Get,
  Res,
  Post,
  Body,
  Param,
} from '@nestjs/common';
import { TimelogService } from './timelog.service';
import { TimelogDto } from './timelog.dto';

@ApiTags('timelog')
@Controller('timelog')
export class TimelogController {
  public constructor(private readonly timelogService: TimelogService) {}

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  @ApiOperation({
    summary: 'Find all timelogs.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Found timelogs',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Record not found',
  })
  @Get()
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public async findTimelogs(@Res() res: any) {
    try {
      const timelogs = await this.timelogService.findTimelogs();
      return res.status(HttpStatus.OK).json({ data: timelogs, error: null });
    } catch (e) {
      console.log(e);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ data: null, e });
    }
  }

  @ApiOperation({
    summary: 'Find month timelogs by uid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Found timelogs',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Record not found',
  })
  @Get('findByUid/:uid')
  async findByMonthForUser(@Param('uid') uid: string): Promise<TimelogDto[]> {
    return this.timelogService.findByMonthForUser(uid);
  }

  @ApiOperation({
    summary: 'Create new timelog',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Success add timelog',
  })
  @Post()
  async createTimelog(@Body() timelog: TimelogDto): Promise<any> {
    return this.timelogService.createTimelog(timelog);
  }
}
