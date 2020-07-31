import * as jwt from 'jsonwebtoken';
import { Inject, Injectable } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { UserDto } from 'src/user/user.dto';
import { ConfigService } from '@nestjs/config';
import { User, IUser } from 'src/user/user.schema';

@Injectable()
export class AuthService {
  public constructor(
    @Inject('UserModelToken')
    private readonly _userModel: mongoose.Model<IUser>,
    private readonly _config: ConfigService,
  ) {}

  public async createToken(user: UserDto): Promise<User> {
    const secret: any = this._config.get('secret');
    const { email } = user;

    const payload: { email: string } = {
      email,
    };

    const accessToken: string = jwt.sign(payload, secret);

    return {
      ...user,
      accessToken,
    } as User;
  }

  public async validateUser(email: string): Promise<IUser> {
    const user: any = await this._userModel
      .findOne({ email })
      .lean()
      .exec();
    return user;
  }

  public async createUser(createUserDto: Partial<IUser>): Promise<IUser> {
    return await this._userModel.create(createUserDto);
  }

  public async getUser(query: Partial<User>): Promise<IUser | null> {
    return await this._userModel
      .findOne(query)
      .lean()
      .exec();
  }
}
