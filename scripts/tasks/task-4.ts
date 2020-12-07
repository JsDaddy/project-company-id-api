import { ITask } from '../tasksRunner';
import * as mongodb from 'mongodb';
import { Db } from 'mongodb';
import moment from 'moment';

// VACATIONS
export async function task(): Promise<ITask | null> {
  const dbName: string = process.env.DATABASE_NAME as string;
  const dbPath: string = `${process.env.DATABASE_PATH}/${dbName}` as string;
  const connection: mongodb.MongoClient = await mongodb.MongoClient.connect(
    dbPath,
    { useNewUrlParser: true },
  );
  const mongoDb: Db = connection.db(dbName);
  const now: Date = new Date();
  if (now.getDay() > 5) {
    return null;
  }
  now.getDay() === 5
    ? now.setDate(now.getDate() + 3)
    : now.setDate(now.getDate() + 1);

  const vacations: any = await mongoDb
    .collection('vacations')
    .aggregate([
      {
        $match: { date: normalizeDate(now), status: 'approved' },
      },
      {
        $lookup: {
          as: 'user',
          foreignField: '_id',
          from: 'users',
          localField: 'uid',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $project: {
          _id: 1,
          slack: '$user.slack',
        },
      },
    ])
    .toArray();
  return {
    ids: vacations.map((user: any) => user.slack),
    message: `:man-surfing: Today your last day before vacation, please finished all tasks, commit to repository and contact your manager`,
    delay: 1000 * 3600 * 8,
  };
}

function normalizeDate(date: Date): Date {
  return moment(date)
    .utcOffset(0)
    .set({ hour: 12, minute: 0, second: 0, millisecond: 0 })
    .toDate();
}
