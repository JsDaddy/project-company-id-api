import * as mongodb from 'mongodb';
import { Db } from 'mongodb';

// SYNC REPO
async function task(): Promise<void> {
  const dbName: string = process.env.DATABASE_NAME as string;
  const dbPath: string = `${process.env.DATABASE_PATH}/${dbName}` as string;
  const connection: mongodb.MongoClient = await mongodb.MongoClient.connect(
    dbPath,
    { useNewUrlParser: true },
  );
  const mongoDb: Db = connection.db(dbName);

  await mongoDb.collection('users').updateOne(
    { lastName: 'Chizhovskiy' },
    {
      $set: {
        avatar:
          '',
      },
    },
  );
}

task();
