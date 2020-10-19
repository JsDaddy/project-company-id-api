import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
// import * as jwt from 'jsonwebtoken';
// import { ConfigService } from '@nestjs/config';
// import { SignUpDto } from '../dto/signup.dto';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from '../interfaces/user.interface';
import { Document } from 'mongoose';
import { IProject } from 'src/project/interfaces/project.interface';

@Injectable()
export class AuthService {
  public constructor(
    @InjectModel('users')
    private readonly _userModel: Model<IUser & Document>, //  private readonly _config: ConfigService,
  ) {}

  // public async createToken(user: SignUpDto): Promise<string> {
  //   const secret: string = this._config.get('SECRET') as string;
  //   const { email } = user;

  //   const payload: { email: string } = {
  //     email,
  //   };

  //   let accessToken: string = '';
  //   accessToken = jwt.sign(payload, secret);

  //   return accessToken;
  // }

  public async setPassword(email: string, password: string): Promise<void> {
    await this._userModel.findOneAndUpdate(
      { email },
      { password, initialLogin: false },
    );
  }
  // public async createUser(
  //   createUserDto: SignUpDto & { accessToken: string },
  // ): Promise<IUser> {
  //   return await this._userModel.create(createUserDto);
  // }

  public async getUser(email: string): Promise<IUser<IProject[]> | null> {
    return (
      await this._userModel.aggregate([
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
          $unwind: {
            path: '$activeProjects',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: '$_id',
            avatar: { $first: '$avatar' },
            lastName: { $first: '$lastName' },
            name: { $first: '$name' },
            projects: { $push: '$projects' },
            initialLogin: { $first: '$initialLogin' },
            position: { $first: '$position' },
            activeProjects: { $push: '$activeProjects' },
            password: { $first: '$password' },
            accessToken: { $first: '$accessToken' },
          },
        },
      ])
    )[0];
  }
}
