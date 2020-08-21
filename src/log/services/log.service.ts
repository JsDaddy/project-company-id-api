import { IHoliday } from './../schemas/holiday.schema';
import { IVacation } from '../../vacations/schemas/vacation.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { ITimelog } from '../../timelogs/schemas/timelog.schema';
import { FilterLogDto } from '../dto/filter-log.dto';
import { IFilterLog } from '../interfaces/filters.interface';
import { ICalendar } from '../interfaces/calendar.interface';

@Injectable()
export class LogService {
  public constructor(
    @InjectModel('timelog') private readonly _timelogModel: Model<ITimelog>,
    @InjectModel('vacations')
    private readonly _vacationModel: Model<IVacation>,
    @InjectModel('holidays')
    private readonly _holidayModel: Model<IHoliday>,
  ) {}
  // tslint:disable-next-line: no-any
  public async findLogs(filterLog: FilterLogDto): Promise<any> {
    const date: Date = new Date(filterLog.first);
    const lastDate: Date = new Date(
      new Date(filterLog.first).setMonth(
        new Date(filterLog.first).getMonth() + 1,
      ),
    );
    let filterByProject: Partial<IFilterLog> = {};
    let filterByUser: Partial<IFilterLog> = {};
    let filterByType: Partial<IFilterLog> = {};
    if (filterLog.type) {
      filterByType = { type: parseInt(filterLog.type) };
    }
    if (filterLog.project) {
      filterByProject = { project: Types.ObjectId(filterLog.project) };
    }
    if (filterLog.uid) {
      filterByUser = { uid: Types.ObjectId(filterLog.uid) };
    }
    // tslint:disable-next-line: no-any
    const matchPipe: any = {
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
    let timelogs: Partial<ITimelog>[] = [];
    let vacations: Partial<IVacation>[] = [];
    let holidays: Partial<IHoliday>[] = [];
    holidays = await this._holidayModel
      .find({
        date: {
          $gte: date.toISOString(),
          $lt: lastDate.toISOString(),
        },
      })
      .lean()
      .exec();
    if (!filterLog.type && filterLog.logType === 'timelogs') {
      timelogs = await this._timelogModel.aggregate([
        {
          $match: matchPipe,
        },
        {
          $project: {
            date: 1,
            time: 1,
          },
        },
      ]);
    }
    if (filterLog.logType === 'vacations') {
      vacations = await this._vacationModel.aggregate([
        {
          $match: matchPipe,
        },
        {
          $project: {
            date: 1,
            status: 1,
          },
        },
      ]);
    }

    let reducedLogs: (
      | Partial<ITimelog>
      | Partial<IVacation>
      | Partial<IHoliday>
    )[] = [...timelogs, ...vacations, ...holidays];
    // tslint:disable-next-line: no-any
    reducedLogs = reducedLogs.reduce((a: any, b: any) => {
      const { time, status, name } = b;
      const dateType: number = time ? 1 : status ? 2 : name ? 3 : -1;
      a[b.date.toISOString()] = a[b.date.toISOString()] || [[], 0, []];
      if (dateType === 2) {
        a[b.date.toISOString()][1] += 1;
      }
      if (dateType === 3) {
        a[b.date.toISOString()][2] = [...a[b.date.toISOString()][2], name];
      }

      if (dateType === 1) {
        a[b.date.toISOString()][0] = [
          ...a[b.date.toISOString()][0],
          this._sumTimeInMinutes([time]),
        ];
      }
      return a;
    }, {});
    const resultObj: Partial<ICalendar> = {};
    // tslint:disable-next-line: typedef
    let monthHours = 0;
    for (const key in reducedLogs) {
      let indexes: number[] = [];
      indexes.push(
        reducedLogs[key][0].length > 0 ? 1 : 0,
        (reducedLogs[key][1] > 0 ? 1 : 0) * 2,
        reducedLogs[key][2].length * 3,
      );
      indexes = indexes.filter((x: number) => x).map((x: number) => x - 1);
      if (indexes.includes(0)) {
        const time: number =
          Math.round(
            (reducedLogs[key][0].reduce(
              (currTime: number, accTime: number) => currTime + accTime,
              0,
            ) /
              60) *
              2,
          ) / 2;
        monthHours += time;
        reducedLogs[key][0] = time;
      }
      const indexType: string[] = ['timelogs', 'vacations', 'holidays'];

      indexes.forEach((index: number) => {
        const str: string = indexType[index];
        resultObj[key] = [
          ...(resultObj[key] ?? []),
          { [str]: reducedLogs[key][index] },
        ];
      });
    }
    const weekHours = this._getWeekDays(date) * 8;
    let holidaysHours = 0;
    if (holidays.length > 0) {
      holidaysHours =
        holidays.filter((holiday: IHoliday) => {
          return this._checkIfWeekDays(new Date(holiday.date));
        }).length * 8;
    }
    console.log(this._hoursInMonth(date));
    console.log(holidaysHours);
    console.log(weekHours);
    return {
      logs: resultObj,
      statistic: {
        workedOut: monthHours,
        toBeWorkedOut: this._hoursInMonth(date) - weekHours - holidaysHours,
      },
    };
  }

  public async findLogByDate(filterLog: FilterLogDto): Promise<any> {
    let filterByUser: Partial<IFilterLog> = {};
    const date: Date = new Date(filterLog.first);
    const lastDate: Date = new Date(
      new Date(filterLog.first).setDate(
        new Date(filterLog.first).getDate() + 1,
      ),
    );
    if (filterLog.uid) {
      filterByUser = { uid: Types.ObjectId(filterLog.uid) };
    }
    let timelogs: Partial<ITimelog>[] = [];
    // let vacations: Partial<IVacation>[] = [];

    if (filterLog.logType === 'timelogs') {
    }
    if (filterLog.logType === 'vacations') {
    }
    if (filterLog.logType === 'all') {
    }
    timelogs = await this._getTimelogsByDate(filterByUser, date, lastDate);
    return timelogs;
  }
  private _checkIfWeekDays(date: Date): boolean {
    console.log(date);
    console.log(date.getDay());
    return date.getDay() === 5 || date.getDay() === 6;
  }
  private _hoursInMonth(date: Date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate() * 8;
  }
  private _getWeekDays(date: Date) {
    let day = 1;
    let counter = 0;
    let newDate = date;
    const year = newDate.getFullYear();
    const month = newDate.getMonth();

    while (newDate.getMonth() === month) {
      if (newDate.getDay() === 0 || newDate.getDay() === 6) {
        counter += 1;
      }
      day += 1;
      newDate = new Date(year, month, day);
    }
    return counter;
  }

  private async _getTimelogsByDate(
    filterByUser: Partial<IFilterLog>,
    date: Date,
    lastDate: Date,
  ): Promise<Partial<ITimelog>[]> {
    return await this._timelogModel.aggregate([
      {
        $match: {
          $and: [
            filterByUser,
            // filterByType,
            {
              date: {
                $gte: date,
                $lt: lastDate,
              },
            },
          ],
        },
      },
      this._getUserLookUp(),
      {
        $unwind: '$user',
      },
      this._getProjectLookUp(),
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
  private _getUserLookUp(): Record<string, unknown> {
    return {
      $lookup: {
        as: 'user',
        foreignField: '_id',
        from: 'users',
        localField: 'uid',
      },
    };
  }
  private _getProjectLookUp(): Record<string, unknown> {
    return {
      $lookup: {
        as: 'project',
        foreignField: '_id',
        from: 'projects',
        localField: 'project',
      },
    };
  }
  // public async findLogs(filterLog: FilterLogDto): Promise<any> {
  //   const date: Date = new Date(filterLog.first);
  //   const lastDate: Date = new Date(
  //     new Date(filterLog.first).setMonth(
  //       new Date(filterLog.first).getMonth() + 1,
  //     ),
  //   );
  //   let filterByProject = {};
  //   let filterByUser = {};
  //   let filterByType = {};
  //   if (filterLog.type) {
  //     filterByType = { type: parseInt(filterLog.type) };
  //   }
  //   if (filterLog.project) {
  //     filterByProject = { project: Types.ObjectId(filterLog.project) };
  //   }
  //   if (filterLog.uid) {
  //     filterByUser = { uid: Types.ObjectId(filterLog.uid) };
  //   }
  //   let timelogs: Partial<ITimelog>[] = [];
  //   let vacations: Partial<IVacation>[] = [];
  //   const matchPipe = {
  //     $and: [
  //       filterByUser,
  //       filterByProject,
  //       filterByType,
  //       {
  //         date: {
  //           $gte: date,
  //           $lt: lastDate,
  //         },
  //       },
  //     ],
  //   };
  //   const userLookup = {
  //     $lookup: {
  //       as: 'user',
  //       foreignField: '_id',
  //       from: 'users',
  //       localField: 'uid',
  //     },
  //   };
  //   const projectLookup = {
  //     $lookup: {
  //       as: 'project',
  //       foreignField: '_id',
  //       from: 'projects',
  //       localField: 'project',
  //     },
  //   };
  //   if (
  //     !filterLog.type &&
  //     (filterLog.logType === 'all' || filterLog.logType === 'timelog')
  //   ) {
  //     timelogs = await this._timelogModel.aggregate([
  //       {
  //         $match: matchPipe,
  //       },
  //       userLookup,
  //       {
  //         $unwind: '$user',
  //       },
  //       projectLookup,
  //       {
  //         $unwind: '$project',
  //       },
  //       {
  //         $project: {
  //           _id: 1,
  //           'user._id': 1,
  //           // 'user.avatar': 1,
  //           'project._id': 1,
  //           'project.name': 1,
  //           time: 1,
  //           date: 1,
  //           desc: 1,
  //         },
  //       },
  //     ]);
  //   }
  //   if (filterLog.logType === 'all' || filterLog.logType === 'vacations') {
  //     vacations = await this._vacationgModel.aggregate([
  //       {
  //         $match: matchPipe,
  //       },
  //       userLookup,
  //       {
  //         $unwind: '$user',
  //       },
  //       {
  //         $project: {
  //           _id: 1,
  //           'user._id': 1,
  //           // 'user.avatar': 1,
  //           type: 1,
  //           date: 1,
  //           status: 1,
  //           desc: 1,
  //         },
  //       },
  //     ]);
  //   }

  //   const logs = [...timelogs, ...vacations];
  //   return logs.reduce(this._reduceLogs, {});
  // }
  private _sumTimeInMinutes(times: any[]): number {
    let h = 0;
    let m = 0;
    const reg1 = /\d+(?=h)/;
    const reg2 = /\d+(?=m)/;
    for (const time of times) {
      h += parseInt(time.match(reg1)) || 0;
      m += parseInt(time.match(reg2)) || 0;
    }
    return h * 60 + m;
  }

  // private _reduceLogs

  //   public async findUserLogs(
  //     _id: string,
  //     first: string,
  //   ): Promise<Partial<ITimelog | Partial<IVacation>>[]> {
  //     let timelogs: Partial<ITimelog>[] = [];
  //     let vacations: Partial<IVacation>[] = [];
  //     const date: Date = new Date(first);
  //     const lastDate: Date = new Date(
  //       new Date(first).setMonth(new Date(first).getMonth() + 1),
  //     );
  //     const matchPipe = {
  //       $and: [
  //         { uid: Types.ObjectId(_id) },
  //         {
  //           date: {
  //             $gte: date,
  //             $lt: lastDate,
  //           },
  //         },
  //       ],
  //     };
  //     const projectLookup = {
  //       $lookup: {
  //         as: 'project',
  //         foreignField: '_id',
  //         from: 'projects',
  //         localField: 'project',
  //       },
  //     };
  //     timelogs = await this._timelogModel.aggregate([
  //       { $match: matchPipe },
  //       projectLookup,
  //       {
  //         $unwind: '$project',
  //       },
  //       {
  //         $project: {
  //           _id: 1,
  //           'project._id': 1,
  //           'project.name': 1,
  //           time: 1,
  //           date: 1,
  //           desc: 1,
  //         },
  //       },
  //     ]);
  //     vacations = await this._vacationgModel
  //       .find({
  //         $and: [
  //           { uid: Types.ObjectId(_id) },
  //           {
  //             date: {
  //               $gte: date.toISOString(),
  //               $lt: lastDate.toISOString(),
  //             },
  //           },
  //         ],
  //       })
  //       .lean()
  //       .exec();
  //     return [...timelogs, ...vacations];
  //   }
}
