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
import { LoginDto } from '../dto/login.dto';

import { IUser, User } from '../schemas/user.schema';
import { SignUpDto } from '../dto/signup.dto';

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
    @Body() createUserDto: SignUpDto,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const { email, password } = createUserDto;
      const user: Partial<IUser> | null = await this._authService.getUser(
        email,
      );
      if (user) {
        return res.status(HttpStatus.CONFLICT).json({
          data: null,
          error: 'Invalid username or email already exists',
        });
      }
      const hash: string = await bcrypt.hash(password, 10);
      let userForCreate: User = {
        ...createUserDto,
        password: hash,
      };
      userForCreate = await this._authService.createToken(userForCreate);
      const newUser: Partial<IUser> = await this._authService.createUser(
        userForCreate,
      );
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
      const { password, ...user }: any = await this._authService.getUser(email);
      if (!user || (user && !(await bcrypt.compare(lpassword, password)))) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          data: null,
          error: 'Invalid email and/or password',
        });
      }
      delete user.password;
      return res.status(HttpStatus.OK).json({ data: user, error: null });
    } catch (error) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ data: null, error: 'Invalid email and/or password' });
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('set-password')
  @ApiOperation({ description: 'User sign in' })
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Wrong email or password',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public async setPassword(
    @Body() loginUserDto: { password: string },
    @Req() req: any,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const email: string = req.user.email;
      const { password } = loginUserDto;
      const hash: string = await bcrypt.hash(password, 10);
      await this._authService.setPassword(email, hash);

      return res
        .status(HttpStatus.OK)
        .json({ data: 'Your password has been changed', error: null });
    } catch (error) {
      console.log(error);
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ data: null, error: 'Someting went wrong' });
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
