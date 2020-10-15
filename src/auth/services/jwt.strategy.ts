import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { IUser } from '../interfaces/user.interface';
import { IProject } from 'src/project/interfaces/project.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  public constructor(
    _configService: ConfigService,
    private _authService: AuthService,
  ) {
    super({
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: _configService.get('SECRET'),
    });
  }

  public async validate(payload: {
    email: string;
  }): Promise<IUser<IProject[]> | null> {
    const user: IUser<IProject[]> | null = await this._authService.getUser(
      payload.email,
    );
    if (!user) {
      return null;
    }
    delete user.password;
    return user;
  }
}
