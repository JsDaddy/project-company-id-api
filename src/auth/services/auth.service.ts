import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
// import * as jwt from 'jsonwebtoken';
// import { ConfigService } from '@nestjs/config';
// import { SignUpDto } from '../dto/signup.dto';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from '../interfaces/user.interface';
import { Document } from 'mongoose';
import { SignUpDto } from '../dto/signup.dto';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  public constructor(
    @InjectModel('users')
    private readonly _userModel: Model<IUser & Document>, //  private readonly _config: ConfigService,
  ) {}

  public async setPassword(
    email: string,
    password: string,
  ): Promise<IUser | null> {
    return await this._userModel.findOneAndUpdate(
      { email },
      { $set: { password, initialLogin: false } },
    );
  }

  public async createToken(payload: SignUpDto): Promise<string> {
    return jwt.sign({ email: payload.email }, process.env.SECRET ?? 'secret');
  }

  public async createUser(
    createUserDto: SignUpDto & { accessToken: string },
  ): Promise<IUser> {
    return await this._userModel.create(createUserDto);
  }

  public async getUser(email: string): Promise<IUser | null> {
    return (
      await this._userModel.aggregate([
        { $match: { email } },
        {
          $group: {
            _id: '$_id',
            email: { $first: '$email' },
            avatar: { $first: '$avatar' },
            lastName: { $first: '$lastName' },
            name: { $first: '$name' },
            initialLogin: { $first: '$initialLogin' },
            position: { $first: '$position' },
            password: { $first: '$password' },
            accessToken: { $first: '$accessToken' },
            endDate: { $first: '$endDate' },
          },
        },
      ])
    )[0];
  }
}
