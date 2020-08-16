import { CreateTimelogDto } from './../dto/timelog.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { FilterTimelogDto } from '../dto/filter-timelog.dto';
import { ITimelog } from '../schemas/timelog.schema';

@Injectable()
export class TimelogService {
  public constructor(
    @InjectModel('timelog') private readonly _timelogModel: Model<ITimelog>,
    @InjectModel('vacations') private readonly _vacationgModel: Model<any>,
  ) {}

  public async createTimelog(timelog: CreateTimelogDto): Promise<ITimelog> {
    const createdTimelog = new this._timelogModel(timelog);
    return createdTimelog.save();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public async findTimelogs(filterTimelog: FilterTimelogDto): Promise<any> {
    const date: Date = new Date(filterTimelog.first);
    const lastDate: string = new Date(
      new Date(filterTimelog.first).setMonth(
        new Date(filterTimelog.first).getMonth() + 1,
      ),
    ).toISOString();
    let filterByUser = {};
    if (filterTimelog.uid) {
      filterByUser = { uid: new Types.ObjectId(filterTimelog.uid) };
    }
    let timelogs: Partial<ITimelog>[];
    let vacations: any;
    const filter: any = {
      $and: [
        filterByUser,
        {
          date: {
            $gte: date.toISOString(),
            $lt: lastDate,
          },
        },
      ],
    };
    timelogs = await this._timelogModel
      .find(filter)
      .lean()
      .exec();
    vacations = await this._vacationgModel
      .find(filter)
      .lean()
      .exec();
    return [...vacations, ...timelogs];
  }

  public async findTimelogsByUser(_id: string): Promise<ITimelog[]> {
    return await this._timelogModel.find({ _id });
  }
}
