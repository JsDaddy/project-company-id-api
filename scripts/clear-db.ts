import * as mongodb from 'mongodb';
import * as ora from 'ora';
import { Db } from 'mongodb';
import { getCollection } from './get-data';
// const collectionNames = ['holiday', 'rule'];
const dbName = 'company-id-mongodb';
const dbPath = 'mongodb://localhost:27017/company-id-mongodb';
// const dbPath = 'mongodb://mongodb:27017/company-id-mongodb';

async function clearDb(): Promise<void> {
  const spinner: ora.Ora = ora('Loading').start();
  let db: Db;
  let connection: mongodb.MongoClient;
  try {
    spinner.text = 'Connect to db';
    connection = await mongodb.MongoClient.connect(dbPath, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = connection.db(dbName);
    spinner.text = `Deleting holidays collection`;
    await db.collection('holiday').drop();
    await db.createCollection('holiday');
    const collectionItems = await getCollection('holidays');
    spinner.text = `Filling holiday collection`;
    await db.collection('holiday').insertMany(collectionItems);
    // const result = await Promise.all(
    //   collectionNames.map(async name => {
    //     spinner.text = `Deleting ${name} collection`;
    //     await db.collection(`${name}`).drop();
    //     await db.createCollection(`${name}`);
    //     const collectionItems = await getCollection(`${name}s`);
    //     console.log(collectionItems);
    //     spinner.text = `Filling ${name} collection`;
    //     await db.collection(`${name}`).insertMany(collectionItems);
    //     return true;
    //   }),
    // );
    // if (result) spinner.text = `Filling collection finished`;
  } catch (e) {
    console.log(e);
    process.exit();
  }
  spinner.stop();
  await connection.close();
}

clearDb();
