import { UserDto } from './user.dto';
import { Controller, HttpStatus, Res, Get, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  public constructor(private readonly userService: UserService) {}

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
    summary: 'Create new user',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Success add user',
  })
  @Post()
  async createUser(@Body() user: UserDto): Promise<any> {
    return this.userService.createUser(user);
  }
}
