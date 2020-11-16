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
// import { SignUpDto } from '../dto/signup.dto';
import { IUser } from '../interfaces/user.interface';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  public constructor(private readonly _authService: AuthService) {}
  // @Post('signup')
  // @ApiOperation({ description: 'User sign up (create user)' })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'The record has been successfully created.',
  // })
  // @ApiResponse({
  //   status: HttpStatus.BAD_REQUEST,
  //   description: 'The record already exists',
  // })
  // public async signUp(
  //   @Body() createUserDto: SignUpDto,
  //   @Res() res: Response,
  // ): Promise<Response> {
  //   try {
  //     const { email, password } = createUserDto;
  //     const user: IUser<IProject[]> | null = await this._authService.getUser(
  //       email,
  //     );
  //     if (user) {
  //       return res.status(HttpStatus.CONFLICT).json({
  //         data: null,
  //         error: 'Invalid username or email already exists',
  //       });
  //     }
  //     const hash: string = await bcrypt.hash(password, 10);
  //     const userForCreate: SignUpDto = {
  //       ...createUserDto,
  //       password: hash,
  //     };
  //     const accessToken: string = await this._authService.createToken(
  //       userForCreate,
  //     );
  //     const createdUser: IUser = await this._authService.createUser({
  //       accessToken,
  //       ...userForCreate,
  //     });
  //     delete createdUser.password;
  //     return res.status(HttpStatus.OK).json({ data: createdUser, error: null });
  //   } catch (error) {
  //     return res.status(HttpStatus.BAD_REQUEST).json({ data: null, error });
  //   }
  // }

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
      const { email, password } = loginUserDto;
      const user: IUser | null = await this._authService.getUser(email);
      if (
        !user ||
        (user && !(await bcrypt.compare(password, user.password ?? '')))
      ) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          data: null,
          error: 'Invalid email and/or password',
        });
      }
      if (user && user.endDate !== null) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          data: null,
          error: 'User is fired.',
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
  public async setPassword(
    @Body() loginUserDto: { password: string },
    // tslint:disable-next-line:no-any
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const user: IUser = req.user as IUser;
      const { email } = user;
      const { password } = loginUserDto;
      const hash: string = await bcrypt.hash(password, 10);
      await this._authService.setPassword(email, hash);
      return res
        .status(HttpStatus.OK)
        .json({ data: 'Password changed.', error: null });
    } catch (error) {
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
      const user: IUser = req.user as IUser;
      if (user && user.endDate !== null) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          data: null,
          error: 'User is fired.',
        });
      }
      return res.status(HttpStatus.OK).json({ data: req.user, error: null });
    } catch (error) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ data: null, error: 'Not authorized' });
    }
  }
}
