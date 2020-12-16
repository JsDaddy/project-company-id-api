import { ITask } from '../tasksRunner';
import * as mongodb from 'mongodb';
import { Db } from 'mongodb';

// STATUS UPDATE
export async function task(): Promise<ITask | null> {
  const nowDay: number = new Date().getDay();
  if (nowDay === 0 || nowDay === 6) {
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
    await mongoDb.collection('users').find().toArray()
  ).map((user: any) => {
    return !user.endDate ? user.slack : null;
  });
  return {
    ids: slacks,
    message: ':calendar: Don`t forget to leave your status update',
    delay: 5000,
  };
}
