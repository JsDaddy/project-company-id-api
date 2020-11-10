import { normalizeDate } from 'scripts/get-data';
import { Positions } from 'src/auth/enums/positions.enum';
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
  Get,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateVacationDto, VacationType } from '../dto/create-vacation.dto';
import { Request, Response } from 'express';
import { ParseObjectIdPipe } from 'src/shared/pipes/string-object-id.pipe';
import { Types } from 'mongoose';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { IUser } from 'src/auth/interfaces/user.interface';

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
      const { date } = createVacationDto;
      const { _id: uid } = req.user as IUser;
      const vacation: IVacation = await this._vacationsService.createVacation({
        ...createVacationDto,
        date: normalizeDate(new Date(date)),
        uid,
      });
      return res.status(HttpStatus.OK).json({ data: vacation, error: null });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ data: null, error });
    }
  }

  @UseGuards(AuthGuard('jwt'), new RolesGuard(Positions.OWNER))
  @Put(':vacationId')
  @ApiOperation({ description: 'Change status of vacation' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The status has been successfully changed.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The status has not been changed.',
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
    @Body() changeStatusDto: ChangeStatusDto,
    @Res() res: Response,
    @Param('vacationId', ParseObjectIdPipe) vacationId: Types.ObjectId,
  ): Promise<Response> {
    try {
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

  @UseGuards(AuthGuard('jwt'), new RolesGuard(Positions.OWNER))
  @Get('requests')
  @ApiOperation({ description: 'Find all vacations (in pending).' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Found vacations (in pending).',
  })
  public async getVacations(@Res() res: Response): Promise<Response> {
    try {
      // tslint:disable-next-line:no-any
      const vacations: any[] = await this._vacationsService.getVacations();
      return res
        .status(HttpStatus.OK)
        .json({ data: [...vacations], error: null });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ data: null, error });
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('count/:uid')
  @ApiOperation({ description: 'Find count of available vacations.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Found vacations count.',
  })
  public async availableCount(
    @Param('uid') uid: string,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      // tslint:disable-next-line:no-any
      const count: number = await this._vacationsService.availableCount(
        uid,
        VacationType.VacationPaid,
      );
      return res.status(HttpStatus.OK).json({ data: count, error: null });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ data: null, error });
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('sick/count/:uid')
  @ApiOperation({ description: 'Find count of available sick leaves.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Found sick leaves count.',
  })
  public async availableSickCount(
    @Param('uid') uid: string,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      // tslint:disable-next-line:no-any
      const count: number = await this._vacationsService.availableCount(
        uid,
        VacationType.SickPaid,
        5,
      );
      return res.status(HttpStatus.OK).json({ data: count, error: null });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ data: null, error });
    }
  }
}
