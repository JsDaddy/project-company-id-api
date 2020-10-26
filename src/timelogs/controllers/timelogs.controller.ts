import { ChangeTimelogDto } from './../dto/change-timelog.dto';
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
  Get,
  Put,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TimelogsService } from '../services/timelogs.service';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { ITimelog } from '../interfaces/timelog.interface';
import { IUser } from 'src/auth/interfaces/user.interface';

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

  @UseGuards(AuthGuard('jwt'))
  @Get(':timelogId')
  @ApiOperation({ description: 'Find timelog' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Found timelog',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Timelog not found.',
  })
  public async findTimelog(
    @Res() res: Response,
    @Param('timelogId') timelogId: string,
  ): Promise<Response> {
    try {
      const timelog: ITimelog | null = await this._timelogsService.findTimelog(
        timelogId,
      );
      if (!timelog) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ data: null, error: 'Timelog not found.' });
      }
      return res.status(HttpStatus.OK).json({ data: timelog, error: null });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ data: null, error });
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':timelogId')
  @ApiOperation({ description: 'Change timelog' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Timelog changed',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Timelog not found.',
  })
  public async changeTimelog(
    @Res() res: Response,
    @Param('timelogId') timelogId: string,
    @Body() changeTimelogDto: ChangeTimelogDto,
  ): Promise<Response> {
    try {
      const timelog: ITimelog | null = await this._timelogsService.changeTimelog(
        timelogId,
        changeTimelogDto,
      );
      if (!timelog) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ data: null, error: 'Timelog not found.' });
      }
      return res.status(HttpStatus.OK).json({ data: timelog, error: null });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ data: null, error });
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':timelogId')
  @ApiOperation({ description: 'Delete timelog' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Timelog deleted',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Timelog not found.',
  })
  public async deleteTimelog(
    @Res() res: Response,
    @Param('timelogId') timelogId: string,
  ): Promise<Response> {
    try {
      await this._timelogsService.deleteTimelog(timelogId);

      return res
        .status(HttpStatus.OK)
        .json({ data: 'Timelog successfully deleted.', error: null });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ data: null, error });
    }
  }
}
