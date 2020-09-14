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

  public async getUser(email: string): Promise<Partial<IUser> | null> {
    const users: Partial<IUser>[] = await this._userModel.aggregate([
      { $match: { email } },
      {
        $lookup: {
          as: 'projects',
          foreignField: '_id',
          from: 'projects',
          localField: 'projects',
        },
      },
      { $unwind: { path: '$projects', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          as: 'activeProjects',
          foreignField: '_id',
          from: 'projects',
          localField: 'activeProjects',
        },
      },
      {
        $unwind: { path: '$activeProjects', preserveNullAndEmptyArrays: true },
      },
      {
        $group: {
          _id: '$_id',
          avatar: { $first: '$avatar' },
          lastName: { $first: '$lastName' },
          name: { $first: '$name' },
          projects: { $push: '$projects' },
          initialLogin: { $first: '$initialLogin' },
          role: { $first: '$role' },
          activeProjects: { $push: '$activeProjects' },
          password: { $first: '$password' },
        },
      },
    ]);
    return users[0];
  }
}
