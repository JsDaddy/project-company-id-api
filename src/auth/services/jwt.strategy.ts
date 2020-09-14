import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { IUser } from '../schemas/user.schema';

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
  }): Promise<null | Partial<IUser>> {
    const user: Partial<IUser> | null = await this._authService.getUser(
      payload.email,
    );
    if (!user) {
      return null;
    }
    delete user.password;
    return user;
  }
}
