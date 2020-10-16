import { ChangeStatusDto } from './../dto/change-status.dto';
import { IVacation } from 'src/vacations/interfaces/vacation.interface';
import { VacationsService } from './../services/vacations.service';
import {
  Controller,
  UseGuards,
  Post,
  HttpStatus,
  Req,
  Body,
  Res,
  Put,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateVacationDto } from '../dto/create-vacation.dto';
import { IUser } from 'scripts/interfaces/user.interface';
import { Request, Response } from 'express';
import { ParseObjectIdPipe } from 'src/shared/pipes/string-object-id.pipe';
import { Types } from 'mongoose';

@Controller('vacations')
@ApiTags('vacations')
export class VacationsController {
  public constructor(private readonly _vacationsService: VacationsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('')
  @ApiOperation({ description: 'Create vacation' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The vacation has been successfully created.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The vacation has not been created.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Vacation not found.',
  })
  public async createVacation(
    @Req() req: Request,
    @Body() createVacationDto: CreateVacationDto,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const { _id: uid } = req.user as IUser;
      const vacation: IVacation = await this._vacationsService.createVacation({
        ...createVacationDto,
        uid,
      });
      return res.status(HttpStatus.OK).json({ data: vacation, error: null });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ data: null, error });
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':vacationId')
  @ApiOperation({ description: 'Create vacation' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The status has been successfully changed.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The vacation has not been changed.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Vacation not found.',
  })
  public async changeStatus(
    @Req() req: Request,
    @Body() changeStatusDto: ChangeStatusDto,
    @Res() res: Response,
    @Param('vacationId', ParseObjectIdPipe) vacationId: Types.ObjectId,
  ): Promise<Response> {
    try {
      const { role } = req.user as IUser;
      if (role !== 'admin') {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ data: null, error: 'You dont have permissions.' });
      }
      const vacation: IVacation | null = await this._vacationsService.statusChange(
        vacationId,
        changeStatusDto,
      );
      if (!vacation) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ data: null, error: 'Vacation not found.' });
      }
      return res.status(HttpStatus.OK).json({ data: vacation, error: null });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ data: null, error });
    }
  }
}
