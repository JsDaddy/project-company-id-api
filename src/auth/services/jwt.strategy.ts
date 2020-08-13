import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { User } from '../schemas/user.schema';

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

  public async validate(payload: { email: string }): Promise<null | User> {
    const user: User | null = await this._authService.validateUser(
      payload.email,
    );
    if (!user) {
      return null;
    }
    return user;
  }
}
