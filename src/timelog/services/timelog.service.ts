import { CreateTimelogDto } from './../dto/timelog.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { ITimelog } from 'scripts/interfaces/timelog.interface';

@Injectable()
export class TimelogService {
  public constructor(
    @InjectModel('timelog') private readonly timelogModel: Model<any>,
  ) {}

  public async createTimelog(timelog: CreateTimelogDto): Promise<ITimelog> {
    const createdTimelog = new this.timelogModel(timelog);
    return createdTimelog.save();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public async findTimelogs() {
    return this.timelogModel
      .find({})
      .lean()
      .exec();
  }

  public async findTimelogsByUser(_id: string): Promise<ITimelog[]> {
    return await this.timelogModel.find({ _id });
  }
}
