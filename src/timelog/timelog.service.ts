import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { TimelogDto } from './timelog.dto';

@Injectable()
export class TimelogService {
  public constructor(
    @InjectModel('timelog') private readonly timelogModel: Model<any>,
  ) {}

  public async createTimelog(timelog: TimelogDto): Promise<TimelogDto> {
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

  public async findByMonthForUser(uid: string): Promise<TimelogDto[]> {
    return await this.timelogModel.aggregate([{ $match: { uid: uid } }]);
  }
}
