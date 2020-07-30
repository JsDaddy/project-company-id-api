/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDto } from './user.dto';

@Injectable()
export class UserService {
  public constructor(
    @InjectModel('user') private readonly userModel: Model<any>,
  ) {}

  public async createUser(user: UserDto): Promise<UserDto> {
    const createdUser = new this.userModel(user);
    return createdUser.save();
  }

  public async findUsers() {
    return this.userModel
      .find({})
      .lean()
      .exec();
  }
}
