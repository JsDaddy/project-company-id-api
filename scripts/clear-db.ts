import * as mongodb from 'mongodb';
import * as ora from 'ora';
import { Db } from 'mongodb';
import { getCollection } from './get-data';

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
    // await refillCollection(db, 'vacation', 'vacation', spinner);
    // await refillCollection(db, 'timelog', 'timelogs', spinner);
    await refillProjects(db, 'project', 'projects', spinner);
    // await refillCollection(db, 'user', 'users', spinner);
    // await refillCollection(db, 'holiday', 'holidays', spinner);
    // await refillCollection(db, 'technology', 'technologies', spinner);
  } catch (e) {
    console.log(e);
    process.exit();
  }
  spinner.stop();
  await connection.close();
}

// async function refillCollection(
//   db: mongodb.Db,
//   name: string,
//   oldName: string,
//   spinner: ora.Ora,
// ) {
//   spinner.text = `Refilling ${name} collection`;
//   const collectionItems = await getCollection(`${oldName}`);
//   await db.collection(`${name}`).drop();
//   await db.createCollection(`${name}`);
//   if (collectionItems)
//     await db.collection(`${name}`).insertMany(collectionItems);
// }

async function refillProjects(
  db: mongodb.Db,
  name: string,
  oldName: string,
  spinner: ora.Ora,
) {
  spinner.text = `Refilling ${name} collection`;
  const collectionItems = await getCollection(`${oldName}`);
  await db.collection(`${name}`).drop();
  await db.createCollection(`${name}`);
  if (collectionItems)
    for (let i = 0; i < collectionItems.length; i++) {
      let project = {};
      for (const prop in collectionItems[i]) {
        if (
          prop !== 'methodology' &&
          prop !== 'nda' &&
          prop !== 'services' &&
          prop !== 'types' &&
          prop !== 'stack' &&
          prop !== 'industry' 
        ) {
          project = { ...project, [prop]: collectionItems[i][prop] };
        } else if (prop === 'stack') {
          console.log(collectionItems[i].name, collectionItems[i][prop]);
          project = { ...project, [prop]: [] };
        }  
      }
      console.log(project);
    }
}

clearDb();
