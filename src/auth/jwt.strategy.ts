import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { IJwtPayload } from './jwt-payload.interface';
import { IUser } from 'src/user/user.schema';
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  public constructor(
    _configService: ConfigService,
    private _authService: AuthService,
  ) {
    super({
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: _configService.get('secret'),
    });
  }

  public async validate(payload: IJwtPayload): Promise<void | IJwtPayload> {
    const user: IUser = await this._authService.validateUser(payload.email);
    // if (!user) {
    //   return null;
    // }
    return user;
  }
}
