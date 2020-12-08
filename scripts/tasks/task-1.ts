import { ITask } from './../tasksRunner';
import * as mongodb from 'mongodb';
import { Db } from 'mongodb';

// SYNC REPO
export async function task(): Promise<ITask | null> {
  if (new Date().getDay() !== 5) {
    return null;
  }
  const dbName: string = process.env.DATABASE_NAME as string;
  const dbPath: string = `${process.env.DATABASE_PATH}/${dbName}` as string;
  const connection: mongodb.MongoClient = await mongodb.MongoClient.connect(
    dbPath,
    { useNewUrlParser: true },
  );
  const mongoDb: Db = connection.db(dbName);
  const slacks: string[] = (
    await mongoDb.collection('users').find({ position: 'developer' }).toArray()
  ).map((user: any) => (user.endDate === null ? user.slack : null));
  return {
    ids: slacks,
    message:
      ':spiral_calendar_pad: If you have external repository for your project please synchronize it with company repository',
    delay: 1000 * 3600 * 8,
  };
}
