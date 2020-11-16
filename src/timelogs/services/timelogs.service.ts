import { ChangeTimelogDto } from './../dto/change-timelog.dto';
import { CreateTimelogDto } from './../dto/create-timelog.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model, Document, Types } from 'mongoose';
import { ITimelog } from './../interfaces/timelog.interface';

@Injectable()
export class TimelogsService {
  public constructor(
    @InjectModel('timelog')
    private readonly _timelogModel: Model<ITimelog & Document>,
  ) {}

  public async createTimelog(
    createTimelogDto: CreateTimelogDto & {
      uid: Types.ObjectId;
      project: Types.ObjectId;
    },
  ): Promise<ITimelog> {
    return await this._timelogModel.create(createTimelogDto);
  }

  public async findTimelog(id: string): Promise<ITimelog | null> {
    return await this._timelogModel
      .findOne({ _id: Types.ObjectId(id) })
      .lean()
      .exec();
  }
  public async changeTimelog(
    id: string,
    changeTimelogDto: ChangeTimelogDto,
  ): Promise<ITimelog | null> {
    const { date, ...Dto } = changeTimelogDto;

    return await this._timelogModel
      .findOneAndUpdate(
        { _id: Types.ObjectId(id) },
        { $set: Dto },
        { new: true },
      )
      .lean()
      .exec();
  }
  public async deleteTimelog(
    id: string,
    // tslint:disable-next-line:no-any
  ): Promise<any> {
    return await this._timelogModel
      .deleteOne({ _id: Types.ObjectId(id) })
      .lean()
      .exec();
  }
}
