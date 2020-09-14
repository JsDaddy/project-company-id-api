import { Types } from 'mongoose';
import { SignUpDto } from './../dto/signup.dto';
import {
  Controller,
  HttpStatus,
  Res,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { UserService } from '../services/user.service';
import { IUser, User } from '../schemas/user.schema';
import { AuthGuard } from '@nestjs/passport';
import { ParseObjectIdPipe } from 'src/shared/pipes/string-object-id.pipe';

@ApiTags('user')
@Controller('user')
export class UserController {
  public constructor(private readonly userService: UserService) {}
  @UseGuards(AuthGuard('jwt'))
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
  @Post('add-user-to-project/:uid/:projectId')
  public async addUserToProject(
    @Res() res: Response,
    @Param('uid', ParseObjectIdPipe) uid: Types.ObjectId,
    @Param('projectId', ParseObjectIdPipe) projectId: Types.ObjectId,
  ): Promise<Response> {
    try {
      await this.userService.addUserToTheProject(uid, projectId);
      return res
        .status(HttpStatus.OK)
        .json({ data: HttpStatus.OK, error: null });
    } catch (e) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ data: null, e });
    }
  }

  @UseGuards(AuthGuard('jwt'))
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
  @Post('remove-user-from-project/:uid/:projectId')
  public async removeUserFromProject(
    @Res() res: Response,
    @Param('uid', ParseObjectIdPipe) uid: Types.ObjectId,
    @Param('projectId', ParseObjectIdPipe) projectId: Types.ObjectId,
  ): Promise<any> {
    try {
      await this.userService.removeUserFromProject(uid, projectId);
      return res
        .status(HttpStatus.OK)
        .json({ data: HttpStatus.OK, error: null });
    } catch (e) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ data: null, e });
    }
  }

  @UseGuards(AuthGuard('jwt'))
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
  @Post('remove-user-from-active-project/:uid/:projectId')
  public async removeUserFromActiveProject(
    @Res() res: Response,
    @Param('uid', ParseObjectIdPipe) uid: Types.ObjectId,
    @Param('projectId', ParseObjectIdPipe) projectId: Types.ObjectId,
  ): Promise<Response> {
    try {
      await this.userService.removeUserFromActiveProject(uid, projectId);
      return res
        .status(HttpStatus.OK)
        .json({ data: HttpStatus.OK, error: null });
    } catch (e) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ data: null, e });
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
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
  @Get('all')
  public async findUsers(@Res() res: Response): Promise<Response> {
    try {
      const users: Partial<IUser>[] = await this.userService.findUsers();
      return res.status(HttpStatus.OK).json({ data: users, error: null });
    } catch (e) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ data: null, e });
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
  async findUser(@Param('id') id: string): Promise<User> {
    return this.userService.findUser(id);
  }

  @ApiOperation({
    summary: 'Create new user',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Success add user',
  })
  @Post()
  async createUser(@Body() user: SignUpDto): Promise<any> {
    return this.userService.createUser(user);
  }
}
