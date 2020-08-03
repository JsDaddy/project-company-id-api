import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';
import { User } from 'src/auth/dto/user.schema';
import { LoginDto } from '../dto/login.dto';
import { UserDto } from '../dto/user.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  public constructor(private readonly _authService: AuthService) {}
  @Post('signup')
  @ApiOperation({ description: 'User sign up (create user)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully created.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The record already exists',
  })
  public async signUp(
    @Body() createUserDto: UserDto,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const { email, password } = createUserDto;
      const user: User | null = await this._authService.getUser({ email });
      if (user) {
        return res.status(HttpStatus.CONFLICT).json({
          data: null,
          error: 'Invalid username or email already exists',
        });
      }
      const hash: string = await bcrypt.hash(password, 10);
      let userForCreate: UserDto = {
        ...createUserDto,
        password: hash,
      };
      userForCreate = await this._authService.createToken(userForCreate);
      const newUser: User = await this._authService.createUser(userForCreate);
      delete newUser.password;
      return res.status(HttpStatus.OK).json({ data: newUser, error: null });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ data: null, error });
    }
  }
  @Post('signin')
  @ApiOperation({ description: 'User sign in' })
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Wrong email or password',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  public async signIn(
    @Body() loginUserDto: LoginDto,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const { email, password: lpassword } = loginUserDto;
      const { password, ...user }: any = await this._authService.getUser({
        email,
      });
      if (!user || (user && !(await bcrypt.compare(lpassword, password)))) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          data: null,
          error: 'Invalid email and/or password',
        });
      }
      return res.status(HttpStatus.OK).json({ data: user, error: null });
    } catch (error) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ data: null, error: 'Invalid email and/or password' });
    }
  }
  @UseGuards(AuthGuard('jwt'))
  @Post('checktoken')
  @ApiOperation({ description: 'Check user token' })
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  public async checkToken(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      return res.status(HttpStatus.OK).json({ data: req.user, error: null });
    } catch (error) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ data: null, error: 'Not authorized' });
    }
  }
}
