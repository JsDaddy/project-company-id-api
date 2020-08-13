import { SignUpDto } from './../dto/signup.dto';
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser, User } from '../schemas/user.schema';

@Injectable()
export class UserService {
  public constructor(
    @InjectModel('users') private readonly userModel: Model<IUser>,
  ) {}

  public async createUser(user: SignUpDto): Promise<User> {
    const createdUser = new this.userModel(user);
    return createdUser.save();
  }

  public async findUsers() {
    return this.userModel
      .find()
      .lean()
      .exec();
  }

  public async findUser(id: string): Promise<User> {
    const users = await this.userModel.aggregate([{ $match: { _id: id } }]);
    return users[0];
  }
}
