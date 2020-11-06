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
  ParseBoolPipe,
  Delete,
  Put,
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
  @Post(':uid/projects/:projectId/:isActive')
  public async addUserToProject(
    @Res() res: Response,
    @Param('uid', ParseObjectIdPipe) uid: Types.ObjectId,
    @Param('isActive', ParseBoolPipe) isActive: boolean,
    @Param('projectId', ParseObjectIdPipe) projectId: Types.ObjectId,
  ): Promise<Response> {
    try {
      const user: Partial<
        IUser
      > | null = await this.userService.addUserToTheProject(
        uid,
        projectId,
        isActive,
      );
      if (!user) {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ data: null, error: 'User doesnt exist' });
      }
      if (user.hasOwnProperty('endDate')) {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ data: null, error: 'User is fired.' });
      }
      return res.status(HttpStatus.OK).json({ data: user, error: null });
    } catch (e) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ data: null, e });
    }
  }
  @UseGuards(AuthGuard('jwt'), new RolesGuard(Positions.OWNER))
  @ApiOperation({
    summary: 'Add user to project (return project).',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User has been added to project ',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'User has not been added to project',
  })
  @Post(':uid/projects-return/:projectId/:isActive')
  public async addUserToProjectWithReturn(
    @Res() res: Response,
    @Param('uid', ParseObjectIdPipe) uid: Types.ObjectId,
    @Param('isActive', ParseBoolPipe) isActive: boolean,
    @Param('projectId', ParseObjectIdPipe) projectId: Types.ObjectId,
  ): Promise<Response> {
    try {
      const user: IUser | null = await this.userService.getUser(
        uid.toHexString(),
      );
      if (user && user.hasOwnProperty('endDate')) {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ data: null, error: 'User is fired.' });
      }
      const project: Partial<
        IProject
      > | null = await this.userService.addUserToTheProjectWithReturn(
        uid,
        projectId,
        isActive,
      );
      if (!project) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          data: null,
          error:
            'User or project doesnt exist / user already added to this project',
        });
      }
      return res.status(HttpStatus.OK).json({ data: project, error: null });
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
  @Delete(':uid/active-project/:projectId')
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
  @Get('all/:isNotFired')
  public async findUsers(
    @Res() res: Response,
    @Req() req: Request,
    @Param('isNotFired', ParseBoolPipe) isNofFired: boolean,
  ): Promise<Response> {
    try {
      const { position } = req.user as IUser<IProject[], Positions>;
      const param: boolean =
        position === Positions.DEVELOPER ? true : isNofFired;
      const users: Partial<IUser>[] = await this.userService.getUsers(param);
      console.log(users.length);

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
    summary: 'Find users by stack',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Found users',
  })
  @Get('stack/:sid')
  public async findUsersByStack(
    @Param('sid') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const users: Partial<IUser>[] = await this.userService.findUsersByStack(
        id,
      );

      return res.status(HttpStatus.OK).json({
        data: users,
        error: null,
      });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ data: null, error });
    }
  }

  @ApiOperation({
    summary: 'Archivate user by id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User archived',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  @Put(':id')
  public async archiveUser(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const user: IUser | null = await this.userService.archivateUser(id);
      if (!user) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ data: null, error: 'User not found' });
      }
      return res.status(HttpStatus.OK).json({
        data: user,
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
      const users: Partial<IUser>[] = await this.userService.findUsersFor(pid);
      return res.status(HttpStatus.OK).json({ data: users, error: null });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ data: null, error });
    }
  }
  @ApiOperation({
    summary: 'Find absent users for projects.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Found absent users',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'projects not found',
  })
  @Get('absent/projects/:pid')
  public async findAbsentUsersFor(
    @Param('pid') pid: string,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const users: Partial<IUser>[] = await this.userService.findUsersFor(
        pid,
        true,
      );
      return res.status(HttpStatus.OK).json({ data: users, error: null });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ data: null, error });
    }
  }
}
