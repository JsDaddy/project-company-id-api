import { IVacation } from './../../vacation/schemas/vacation.schema';
import { CreateTimelogDto } from '../dto/create-timelog.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { ITimelog } from '../schemas/timelog.schema';
import { FilterLogDto } from '../dto/filter-log.dto';

@Injectable()
export class LogService {
  public constructor(
    @InjectModel('timelog') private readonly _timelogModel: Model<ITimelog>,
    @InjectModel('vacations')
    private readonly _vacationgModel: Model<IVacation>,
  ) {}

  public async createTimelog(timelog: CreateTimelogDto): Promise<ITimelog> {
    const createdTimelog = new this._timelogModel(timelog);
    return createdTimelog.save();
  }

  public async findLogs(
    filterLog: FilterLogDto,
  ): Promise<Partial<ITimelog> | Partial<IVacation>[]> {
    const date: Date = new Date(filterLog.first);
    const lastDate: Date = new Date(
      new Date(filterLog.first).setMonth(
        new Date(filterLog.first).getMonth() + 1,
      ),
    );
    let filterByProject = {};
    let filterByUser = {};
    let filterByType = {};
    if (filterLog.type) {
      filterByType = { type: parseInt(filterLog.type) };
    }
    if (filterLog.project) {
      filterByProject = { project: Types.ObjectId(filterLog.project) };
    }
    if (filterLog.uid) {
      filterByUser = { uid: Types.ObjectId(filterLog.uid) };
    }
    let timelogs: Partial<ITimelog>[] = [];
    let vacations: Partial<IVacation>[] = [];
    const matchPipe = {
      $and: [
        filterByUser,
        filterByProject,
        filterByType,
        {
          date: {
            $gte: date,
            $lt: lastDate,
          },
        },
      ],
    };
    const userLookup = {
      $lookup: {
        as: 'user',
        foreignField: '_id',
        from: 'users',
        localField: 'uid',
      },
    };
    const projectLookup = {
      $lookup: {
        as: 'project',
        foreignField: '_id',
        from: 'projects',
        localField: 'project',
      },
    };
    if (
      !filterLog.type &&
      (filterLog.logType === 'all' || filterLog.logType === 'timelog')
    ) {
      timelogs = await this._timelogModel.aggregate([
        {
          $match: matchPipe,
        },
        userLookup,
        {
          $unwind: '$user',
        },
        projectLookup,
        {
          $unwind: '$project',
        },
        {
          $project: {
            _id: 1,
            'user._id': 1,
            // 'user.avatar': 1,
            'project._id': 1,
            'project.name': 1,
            time: 1,
            date: 1,
            desc: 1,
          },
        },
      ]);
    }
    if (filterLog.logType === 'all' || filterLog.logType === 'vacations') {
      vacations = await this._vacationgModel.aggregate([
        {
          $match: matchPipe,
        },
        userLookup,
        {
          $unwind: '$user',
        },
        {
          $project: {
            _id: 1,
            'user._id': 1,
            // 'user.avatar': 1,
            type: 1,
            date: 1,
            status: 1,
            desc: 1,
          },
        },
      ]);
    }
    return [...timelogs, ...vacations];
  }

  public async findUserLogs(
    _id: string,
    first: string,
  ): Promise<Partial<ITimelog | Partial<IVacation>>[]> {
    let timelogs: Partial<ITimelog>[] = [];
    let vacations: Partial<IVacation>[] = [];
    const date: Date = new Date(first);
    const lastDate: Date = new Date(
      new Date(first).setMonth(new Date(first).getMonth() + 1),
    );
    const matchPipe = {
      $and: [
        { uid: Types.ObjectId(_id) },
        {
          date: {
            $gte: date,
            $lt: lastDate,
          },
        },
      ],
    };
    const projectLookup = {
      $lookup: {
        as: 'project',
        foreignField: '_id',
        from: 'projects',
        localField: 'project',
      },
    };
    timelogs = await this._timelogModel.aggregate([
      { $match: matchPipe },
      projectLookup,
      {
        $unwind: '$project',
      },
      {
        $project: {
          _id: 1,
          'project._id': 1,
          'project.name': 1,
          time: 1,
          date: 1,
          desc: 1,
        },
      },
    ]);
    vacations = await this._vacationgModel
      .find({
        $and: [
          { uid: Types.ObjectId(_id) },
          {
            date: {
              $gte: date.toISOString(),
              $lt: lastDate.toISOString(),
            },
          },
        ],
      })
      .lean()
      .exec();
    return [...timelogs, ...vacations];
  }
}
