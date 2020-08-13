import { SignUpDto } from './../dto/signup.dto';
import {
  Controller,
  HttpStatus,
  Res,
  Get,
  Post,
  Body,
  Param,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { UserService } from '../services/user.service';
import { User } from '../schemas/user.schema';

@ApiTags('user')
@Controller('user')
export class UserController {
  public constructor(private readonly userService: UserService) {}
  // @UseGuards(AuthGuard('jwt'))
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
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
  @Get()
  public async findUsers(@Res() res: Response) {
    try {
      const users = await this.userService.findUsers();
      return res.status(HttpStatus.OK).json({ data: users, error: null });
    } catch (e) {
      console.log(e);
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
