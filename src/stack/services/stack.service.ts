import { IUser } from './../../auth/interfaces/user.interface';
import { IStack } from './../interfaces/stack.interface';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document, Types } from 'mongoose';

@Injectable()
export class StackService {
  public constructor(
    @InjectModel('stacks')
    private readonly _stackModel: Model<IStack & Document>,
    @InjectModel('users')
    private readonly _userModel: Model<IUser & Document>,
  ) {}
  public async findStack(): Promise<IStack[]> {
    return await this._stackModel.find().lean().exec();
  }

  public async findStackByUid(_uid: string): Promise<IStack[]> {
    return (
      await this._userModel.aggregate([
        { $match: { _id: Types.ObjectId(_uid) } },
        {
          $lookup: {
            as: 'projects',
            foreignField: '_id',
            from: 'projects',
            localField: 'projects',
          },
        },
        { $unwind: '$projects' },

        {
          $group: {
            _id: '$_id',
            lastName: { $first: '$lastName' },
            stack: { $push: '$projects.stack' },
          },
        },
        {
          $project: {
            stack: {
              $reduce: {
                input: '$stack',
                initialValue: [],
                in: {
                  $let: {
                    vars: { elem: { $concatArrays: ['$$this', '$$value'] } },
                    in: { $setUnion: '$$elem' },
                  },
                },
              },
            },
          },
        },
        {
          $lookup: {
            from: 'stacks',
            localField: 'stack',
            as: 'stack',
            foreignField: '_id',
          },
        },
      ])
    )[0].stack;
  }
}
