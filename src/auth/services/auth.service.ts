import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { User, IUser } from '../schemas/user.schema';
import { SignUpDto } from '../dto/signup.dto';

@Injectable()
export class AuthService {
  public constructor(
    @InjectModel('users')
    private readonly _userModel: Model<IUser>,
    private readonly _config: ConfigService,
  ) {}

  public async createToken(user: SignUpDto): Promise<User> {
    const secret: any = this._config.get('SECRET');
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

  public async validateUser(email: string): Promise<User | null> {
    return this._userModel
      .findOne({ email })
      .lean()
      .exec();
  }
  public async setPassword(
    email: string,
    password: string,
  ): Promise<User | null> {
    return this._userModel.findOneAndUpdate(
      { email },
      { password, initialLogin: false },
    );
  }
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public async createUser(createUserDto: any): Promise<IUser> {
    return await this._userModel.create(createUserDto);
  }

  public async getUser(query: Partial<User>): Promise<User | null> {
    return this._userModel
      .findOne(query)
      .lean()
      .exec();
  }
}
