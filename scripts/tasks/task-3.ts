import { ITask } from '../tasksRunner';
import * as mongodb from 'mongodb';
import { Db } from 'mongodb';

// BIRTHDAYS
export async function task(): Promise<ITask | null> {
  const dbName: string = process.env.DATABASE_NAME as string;
  const dbPath: string = `${process.env.DATABASE_PATH}/${dbName}` as string;
  const connection: mongodb.MongoClient = await mongodb.MongoClient.connect(
    dbPath,
    { useNewUrlParser: true },
  );
  const mongoDb: Db = connection.db(dbName);
  const birthdayUsers: IBirthday[] = await mongoDb
    .collection('users')
    .aggregate([
      { $match: { endDate: null } },
      {
        $project: {
          dob: 1,
          slack: 1,
          name: 1,
          lastName: 1,
          month: { $month: '$dob' },
          day: { $dayOfMonth: '$dob' },
        },
      },
      {
        $match: {
          month: new Date().getMonth() + 1,
          day: new Date().getDate(),
        },
      },
      {
        $project: {
          slack: 1,
          fullName: { $concat: ['$name', ' ', '$lastName'] },
        },
      },
    ])
    .toArray();
  if (!birthdayUsers?.length) {
    return null;
  }
  const slacks: string[] = (
    await mongoDb
      .collection('users')
      .find({
        endDate: null,
        slack: {
          $nin: birthdayUsers.map(
            (birthdayUser: IBirthday) => birthdayUser.slack,
          ),
        },
      })
      .toArray()
  ).map((user: any) => user.slack);

  return {
    ids: slacks,
    message: `:birthday: Today is the birthday of ${birthdayUsers
      .map((birthdayUser: IBirthday) => birthdayUser.fullName)
      .toString()}`,
    delay: 0,
  };
}

interface IBirthday {
  _id: string;
  fullName: string;
  slack: string;
}
