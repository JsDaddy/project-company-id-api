import { ParseObjectIdPipe } from './../../shared/pipes/string-object-id.pipe';
import { CreateTimelogDto } from './../dto/create-timelog.dto';
import {
  Controller,
  UseGuards,
  Post,
  Body,
  Res,
  Req,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TimelogsService } from '../services/timelogs.service';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { IUser } from 'scripts/interfaces/user.interface';
import { Types } from 'mongoose';
import { ITimelog } from '../interfaces/timelog.interface';

@Controller('timelogs')
@ApiTags('timelogs')
export class TimelogsController {
  public constructor(private readonly _timelogsService: TimelogsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post(':project')
  @ApiOperation({ description: 'Create timelog' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The timelog has been successfully created.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The timelog has not been created.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  public async createTimelog(
    @Req() req: Request,
    @Body() createTimelogDto: CreateTimelogDto,
    @Param('project', ParseObjectIdPipe) project: Types.ObjectId,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const { _id: uid } = req.user as IUser;
      const timelog: ITimelog = await this._timelogsService.createTimelog({
        ...createTimelogDto,
        uid,
        project,
      });

      return res.status(HttpStatus.OK).json({ data: timelog, error: null });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ data: null, error });
    }
  }
}
