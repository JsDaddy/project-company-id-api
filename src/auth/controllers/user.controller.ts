import { VacationsService } from './../../vacations/services/vacations.service';
import { Positions } from 'src/auth/enums/positions.enum';
import { Types } from 'mongoose';
import {
  Controller,
  HttpStatus,
  Res,
  Get,
  Post,
  Param,
  UseGuards,
  Delete,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { UserService } from '../services/user.service';
import { AuthGuard } from '@nestjs/passport';
import { ParseObjectIdPipe } from 'src/shared/pipes/string-object-id.pipe';
import { IUser } from '../interfaces/user.interface';
import { IProject } from 'src/project/interfaces/project.interface';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { VacationType } from 'src/vacations/dto/create-vacation.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  public constructor(
    private readonly userService: UserService,
    private readonly _vacationService: VacationsService,
  ) {}
  @UseGuards(AuthGuard('jwt'), new RolesGuard(Positions.OWNER))
  @ApiOperation({
    summary: 'Add user to project.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User has been added to project',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'User has not been added to project',
  })
  @Post(':uid/projects/:projectId')
  public async addUserToProject(
    @Res() res: Response,
    @Param('uid', ParseObjectIdPipe) uid: Types.ObjectId,
    @Param('projectId', ParseObjectIdPipe) projectId: Types.ObjectId,
  ): Promise<Response> {
    try {
      await this.userService.addUserToTheProject(uid, projectId);
      return res
        .status(HttpStatus.OK)
        .json({ data: 'User has been added to project', error: null });
    } catch (e) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ data: null, e });
    }
  }

  @UseGuards(AuthGuard('jwt'), new RolesGuard(Positions.OWNER))
  @ApiOperation({
    summary: 'Remove user from project.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User has been removed from project',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'User has not been removed from project',
  })
  @Delete(':uid/projects/:projectId')
  public async removeUserFromProject(
    @Res() res: Response,
    @Param('uid', ParseObjectIdPipe) uid: Types.ObjectId,
    @Param('projectId', ParseObjectIdPipe) projectId: Types.ObjectId,
  ): Promise<Response> {
    try {
      await this.userService.removeUserFromProject(uid, projectId);
      return res
        .status(HttpStatus.OK)
        .json({ data: 'User has been removed from project', error: null });
    } catch (e) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ data: null, e });
    }
  }

  @UseGuards(AuthGuard('jwt'), new RolesGuard(Positions.OWNER))
  @ApiOperation({
    summary: 'Remove user from active project.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User has been removed from active project',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'User has not been removed from active project',
  })
  @Post(':uid/active-project/:projectId')
  public async removeUserFromActiveProject(
    @Res() res: Response,
    @Param('uid', ParseObjectIdPipe) uid: Types.ObjectId,
    @Param('projectId', ParseObjectIdPipe) projectId: Types.ObjectId,
  ): Promise<Response> {
    try {
      await this.userService.removeUserFromActiveProject(uid, projectId);
      return res.status(HttpStatus.OK).json({
        data: 'User has been removed from active project',
        error: null,
      });
    } catch (e) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ data: null, e });
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Find all users.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Found users',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Record not found',
  })
  @Get('')
  public async findUsers(
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<Response> {
    try {
      const { position } = req.user as IUser<IProject[], Positions>;

      const users: Partial<IUser>[] = await this.userService.getUsers(position);
      return res.status(HttpStatus.OK).json({ data: users, error: null });
    } catch (error) {
      console.log(error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ data: null, error });
    }
  }

  @ApiOperation({
    summary: 'Find user by id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Found user',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Record not found',
  })
  @Get(':id')
  public async findUser(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const user: IUser<IProject[]> = await this.userService.findUser(id);
      const vacationAvailable: number = await this._vacationService.availableCount(
        id,
        VacationType.VacationPaid,
      );
      const sickAvailable: number = await this._vacationService.availableCount(
        id,
        VacationType.SickPaid,
        5,
      );
      return res.status(HttpStatus.OK).json({
        data: { ...user, vacationAvailable, sickAvailable },
        error: null,
      });
    } catch (e) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ data: null, e });
    }
  }

  @ApiOperation({
    summary: 'Find users for projects.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Found users',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'projects not found',
  })
  @Get('projects/:pid')
  public async findUsersFor(
    @Param('pid') pid: string,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      // tslint:disable-next-line:no-any
      const users: Partial<IUser>[] = await this.userService.findUsersFor(pid);
      return res.status(HttpStatus.OK).json({ data: users, error: null });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ data: null, error });
    }
  }
}
