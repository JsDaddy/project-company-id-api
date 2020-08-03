/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDto } from '../dto/user.dto';
import { IUser } from '../dto/user.schema';

@Injectable()
export class UserService {
  public constructor(
    @InjectModel('user') private readonly userModel: Model<IUser>,
  ) {}

  public async createUser(user: UserDto): Promise<UserDto> {
    const createdUser = new this.userModel(user);
    return createdUser.save();
  }

  public async findUsers() {
    return this.userModel
      .find()
      .lean()
      .exec();
  }

  public async findUser(id: string): Promise<UserDto[]> {
    return await this.userModel.aggregate([{ $match: { _id: id } }]);
  }
}
