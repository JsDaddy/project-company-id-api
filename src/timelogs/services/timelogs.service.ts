import { CreateTimelogDto } from './../dto/create-timelog.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model, Document } from 'mongoose';
import { ITimelog } from '../interfaces/timelog.interface';

@Injectable()
export class TimelogsService {
  public constructor(
    @InjectModel('timelog')
    private readonly _timelogModel: Model<ITimelog & Document>,
  ) {}

  public async createTimelog(
    createTimelogDto: CreateTimelogDto,
  ): Promise<ITimelog> {
    return await this._timelogModel.create(createTimelogDto);
  }
}
