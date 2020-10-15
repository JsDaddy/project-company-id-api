import { DateService } from './date.service';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model, Types, Document } from 'mongoose';
import { FilterLogDto, LogType, VacationType } from '../dto/filter-log.dto';
import { IFilterLog } from '../interfaces/filters.interface';
import { IHoliday } from '../interfaces/holiday.interface';
import { ITimelog } from 'src/timelogs/interfaces/timelog.interface';
import { IVacation } from 'src/vacations/interfaces/vacation.interface';

@Injectable()
export class LogService {
  private _getUserLookUp: Record<string, unknown> = {
    $lookup: {
      as: 'user',
      foreignField: '_id',
      from: 'users',
      localField: 'uid',
    },
  };

  private _getProjectLookUp: Record<string, unknown> = {
    $lookup: {
      as: 'project',
      foreignField: '_id',
      from: 'projects',
      localField: 'project',
    },
  };

  public constructor(
    @InjectModel('timelog')
    private readonly _timelogModel: Model<ITimelog & Document>,
    @InjectModel('vacations')
    private readonly _vacationModel: Model<IVacation & Document>,
    @InjectModel('holidays')
    private readonly _holidayModel: Model<IHoliday & Document>,
    private readonly _dateService: DateService,
  ) {}
  // tslint:disable-next-line: no-any
  public async findLogs(filterLog: FilterLogDto): Promise<any> {
    const date: Date = new Date(filterLog.first);
    const lastDate: Date = this._dateService.getLastDate(filterLog.first);
    let filterByProject: IFilterLog = {};
    let filterByUser: IFilterLog = {};
    let filterByType: IFilterLog = {};

    if (filterLog.type) {
      filterByType = { type: parseInt(VacationType[filterLog.type]) };
    }
    if (filterLog.project) {
      filterByProject = { project: Types.ObjectId(filterLog.project) };
    }
    if (filterLog.uid) {
      filterByUser = { uid: Types.ObjectId(filterLog.uid) };
    }

    let timelogs: ITimelog[] = [];
    let vacations: IVacation[] = [];
    let holidays: IHoliday[] = [];
    holidays = await this._getHolidaysByDate(date, lastDate);
    if (
      !filterLog.type &&
      (filterLog.logType === LogType.Timelogs ||
        filterLog.logType === LogType.All)
    ) {
      timelogs = await this._timelogModel.aggregate([
        {
          $match: this._matchPipe(
            filterByUser,
            filterByProject,
            filterByType,
            date,
            lastDate,
          ),
        },
        {
          $project: {
            date: 1,
            time: 1,
          },
        },
      ]);
    }
    vacations = await this._vacationModel.aggregate([
      {
        $match: this._matchPipe(
          filterByUser,
          filterByProject,
          filterByType,
          date,
          lastDate,
        ),
      },
      {
        $project: {
          date: 1,
          status: 1,
        },
      },
    ]);
    // }
    // tslint:disable-next-line: no-any
    let reducedLogs: any[] = [...timelogs, ...vacations, ...holidays];
    let vacationDays: number = 0;
    // tslint:disable-next-line: no-any
    reducedLogs = reducedLogs.reduce((a: any, b: any) => {
      const { time, status, name } = b;
      const dateType: number = time ? 1 : status ? 2 : name ? 3 : -1;
      a[b.date.toISOString()] = a[b.date.toISOString()] || [[], 0, []];
      if (dateType === 2) {
        a[b.date.toISOString()][1] += 1;
        vacationDays++;
      }
      if (dateType === 3) {
        a[b.date.toISOString()][2] = [...a[b.date.toISOString()][2], name];
      }
      if (dateType === 1) {
        a[b.date.toISOString()][0] = [
          ...a[b.date.toISOString()][0],
          this._dateService.sumTimeInMinutes([time]),
        ];
      }
      return a;
    }, {});
    // tslint:disable-next-line:no-any
    const resultObj: any = {};
    let workedOut: number = 0;
    for (const key in reducedLogs) {
      let indexes: number[] = [];
      indexes.push(
        reducedLogs[key][0].length > 0 ? 1 : 0,
        (reducedLogs[key][1] > 0 ? 1 : 0) * 2,
        reducedLogs[key][2].length * 3,
      );
      indexes = indexes.filter((x: number) => x).map((x: number) => x - 1);
      if (indexes.includes(0)) {
        const roundedTime: number =
          reducedLogs[key][0].reduce(
            (currTime: number, accTime: number) => currTime + accTime,
            0,
          ) / 60;
        const time: number = Math.round(roundedTime * 2) / 2;
        workedOut += roundedTime;
        reducedLogs[key][0] = time;
      }
      const indexType: string[] = [
        LogType.Timelogs,
        LogType.Vacations,
        LogType.Holidays,
      ];

      indexes.forEach((index: number) => {
        const str: string = indexType[index];
        resultObj[key] = [
          ...(resultObj[key] ?? []),
          { [str]: reducedLogs[key][index] },
        ];
      });
    }
    const weekHours: number = this._dateService.getWeekDays(date) * 8;
    let holidaysHours: number = 0;
    if (holidays.length > 0) {
      holidaysHours =
        holidays.filter((holiday: IHoliday) => {
          return this._dateService.checkIfWeekDays(new Date(holiday.date));
        }).length * 8;
    }
    const toBeWorkedOut: number = !filterByUser.uid
      ? 0
      : filterLog.uid
      ? this._dateService.hoursInMonth(date) -
        weekHours -
        holidaysHours -
        vacationDays * 8
      : 0;
    const overtime: number = !filterByUser.uid
      ? 0
      : workedOut > toBeWorkedOut && filterLog.uid
      ? (workedOut - toBeWorkedOut) * 1.5
      : workedOut - toBeWorkedOut;

    return {
      logs: resultObj,
      statistic:
        filterLog.logType === LogType.Vacations
          ? null
          : {
              workedOut: this._dateService.timeToString(workedOut),
              toBeWorkedOut: filterLog.project
                ? null
                : this._dateService.timeToString(toBeWorkedOut),
              overtime: filterLog.project
                ? null
                : this._dateService.timeToString(overtime),
            },
    };
  }

  // tslint:disable-next-line:no-any
  public async findLogByDate(filterLog: FilterLogDto): Promise<any> {
    let filterByUser: Partial<IFilterLog> = {};
    let filterByType: Partial<IFilterLog> = {};
    if (filterLog.type) {
      filterByType = { type: parseInt(filterLog.type.toString()) };
    }
    const date: Date = new Date(filterLog.first);
    const lastDate: Date = this._dateService.getLastDate(filterLog.first);
    if (filterLog.uid) {
      filterByUser = { uid: Types.ObjectId(filterLog.uid) };
    }
    let timelogs: ITimelog[] = [];
    let vacations: IVacation[] = [];
    let holidays: IHoliday[] = [];
    holidays = await this._getHolidaysByDate(date, lastDate);

    if (
      filterLog.logType === LogType.All ||
      filterLog.logType === LogType.Timelogs
    ) {
      timelogs = await this._getTimelogsByDate(filterByUser, date, lastDate);
    }

    if (
      filterLog.logType === LogType.All ||
      filterLog.logType === LogType.Vacations
    ) {
      vacations = await this._getVacationsByDate(
        filterByUser,
        filterByType,
        date,
        lastDate,
      );
    }

    return { logs: [...timelogs, ...vacations, ...holidays] };
  }
  private async _getHolidaysByDate(
    date: Date,
    lastDate: Date,
  ): Promise<IHoliday[]> {
    return this._holidayModel
      .find({
        date: {
          $gte: date.toISOString(),
          $lt: lastDate.toISOString(),
        },
      })
      .lean()
      .exec();
  }
  private async _getTimelogsByDate(
    filterByUser: Partial<IFilterLog>,
    date: Date,
    lastDate: Date,
  ): Promise<ITimelog[]> {
    return await this._timelogModel.aggregate([
      {
        $match: this._matchPipe(filterByUser, {}, {}, date, lastDate),
      },
      this._getUserLookUp,
      {
        $unwind: '$user',
      },
      this._getProjectLookUp,
      {
        $unwind: '$project',
      },
      {
        $project: {
          _id: 1,
          'user._id': 1,
          'user.avatar': 1,
          'project._id': 1,
          'project.name': 1,
          time: 1,
          date: 1,
          desc: 1,
        },
      },
    ]);
  }
  private _matchPipe(
    filterByUser: Partial<IFilterLog>,
    filterByProject: Partial<IFilterLog>,
    filterByType: Partial<IFilterLog>,
    date: Date,
    lastDate: Date,
  ): Record<string, unknown> {
    return {
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
  }
  private async _getVacationsByDate(
    filterByUser: Partial<IFilterLog>,
    filterByType: Partial<IFilterLog>,
    date: Date,
    lastDate: Date,
  ): Promise<IVacation[]> {
    return await this._vacationModel.aggregate([
      {
        $match: this._matchPipe(filterByUser, {}, filterByType, date, lastDate),
      },
      this._getUserLookUp,
      {
        $unwind: '$user',
      },
      {
        $project: {
          _id: 1,
          'user._id': 1,
          'user.avatar': 1,
          type: 1,
          date: 1,
          status: 1,
          desc: 1,
        },
      },
    ]);
  }
}
