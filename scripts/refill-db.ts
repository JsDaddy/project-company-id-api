import { TechnologyDto } from './../src/technology/technology.dto';
import * as mongodb from 'mongodb';
import * as ora from 'ora';
import { Db } from 'mongodb';
import { getCollection } from './get-data';

const dbName = 'company-id-mongodb';
const dbPath = 'mongodb://localhost:27017/company-id-mongodb';
let technologiesList: [] = [];
// const dbPath = 'mongodb://mongodb:27017/company-id-mongodb';

async function refillDb(): Promise<void> {
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
    await refillCollection(db, 'technology', 'technologies', spinner);
    // await refillCollection(db, 'vacation', 'vacation', spinner);
    // await refillCollection(db, 'timelog', 'timelogs', spinner);
    // await refillCollection(db, 'user', 'users', spinner);
    // await refillCollection(db, 'holiday', 'holidays', spinner);
    await refillProjects(db, 'project', 'projects', spinner);
  } catch (e) {
    console.log(e);
    process.exit();
  }
  spinner.stop();
  await connection.close();
}

async function refillCollection(
  db: mongodb.Db,
  name: string,
  oldName: string,
  spinner: ora.Ora,
) {
  spinner.text = `Refilling ${name} collection`;
  const collectionItems = await getCollection(`${oldName}`);
  await db.collection(`${name}`).drop();
  await db.createCollection(`${name}`);
  if (collectionItems && name === 'technology')
    technologiesList = collectionItems;
  if (collectionItems)
    await db.collection(`${name}`).insertMany(collectionItems);
}

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
          const newProps: string[] = [];
          technologiesList.forEach((tech: TechnologyDto) => console.log(tech));
          // collectionItems[i][prop].forEach((el: string) => {
          //   if (el === 'v1GjaaDCupitARn5p8yh') {
          //     technologiesList.forEach((tech: { name: string; _id: any }) => {
          //       if (tech.name === 'sales')
          //         for (const prop in tech) {
          //           if (prop === '_id') el = tech[prop];
          //         }
          //     });
          //   }
          //   if (el === 'thIXy8xt8MaS0B1dKQcf') {
          //     technologiesList.forEach((tech: { name: string; _id: any }) => {
          //       if (tech.name === 'rxjs')
          //         for (const prop in tech) {
          //           if (prop === '_id') el = tech[prop];
          //         }
          //     });
          //   }
          //   if (el === 'qfcBroBDuHKV2c7gQpmM') {
          //     technologiesList.forEach((tech: { name: string; _id: any }) => {
          //       if (tech.name === 'firebase')
          //         for (const prop in tech) {
          //           if (prop === '_id') el = tech[prop];
          //         }
          //     });
          //   }
          //   if (el === 'b8dbyKIBz7UIvmrJqukd') {
          //     technologiesList.forEach((tech: { name: string; _id: any }) => {
          //       if (tech.name === 'redux')
          //         for (const prop in tech) {
          //           if (prop === '_id') el = tech[prop];
          //         }
          //     });
          //   }
          //   if (el === 'UuZiQeFIINm1afFp4wB4') {
          //     technologiesList.forEach((tech: { name: string; _id: any }) => {
          //       if (tech.name === 'javascript')
          //         for (const prop in tech) {
          //           if (prop === '_id') el = tech[prop];
          //         }
          //     });
          //   }
          //   if (el === 'U8U4YZemfF91hTKT185X') {
          //     technologiesList.forEach((tech: { name: string; _id: any }) => {
          //       if (tech.name === 'dart')
          //         for (const prop in tech) {
          //           if (prop === '_id') el = tech[prop];
          //         }
          //     });
          //   }
          //   if (el === 'NXtBEYGfjAP97eZIdltK') {
          //     technologiesList.forEach((tech: { name: string; _id: any }) => {
          //       if (tech.name === 'ngrx')
          //         for (const prop in tech) {
          //           if (prop === '_id') el = tech[prop];
          //         }
          //     });
          //   }
          //   if (el === 'NWOfZDoairLVstx8Gcxs') {
          //     technologiesList.forEach((tech: { name: string; _id: any }) => {
          //       if (tech.name === 'react')
          //         for (const prop in tech) {
          //           if (prop === '_id') el = tech[prop];
          //         }
          //     });
          //   }
          //   if (el === 'MviHdA6xDyNgmeeCbzUJ') {
          //     technologiesList.forEach((tech: { name: string; _id: any }) => {
          //       if (tech.name === 'nestjs')
          //         for (const prop in tech) {
          //           if (prop === '_id') el = tech[prop];
          //         }
          //     });
          //   }
          //   if (el === 'L2lBYIn0F8CqjNYEMqWo') {
          //     technologiesList.forEach((tech: { name: string; _id: any }) => {
          //       if (tech.name === 'typescript')
          //         for (const prop in tech) {
          //           if (prop === '_id') el = tech[prop];
          //         }
          //     });
          //   }
          //   if (el === 'JvMKt4HwR2yQT15UMBss') {
          //     technologiesList.forEach((tech: { name: string; _id: any }) => {
          //       if (tech.name === 'nodejs')
          //         for (const prop in tech) {
          //           if (prop === '_id') el = tech[prop];
          //         }
          //     });
          //   }
          //   if (el === 'FUjy1T2X0PSGrZudZpd6') {
          //     technologiesList.forEach((tech: { name: string; _id: any }) => {
          //       if (tech.name === 'rxdart')
          //         for (const prop in tech) {
          //           if (prop === '_id') el = tech[prop];
          //         }
          //     });
          //   }
          //   if (el === 'CeXptrWV4nakIJw5Lgrb') {
          //     technologiesList.forEach((tech: { name: string; _id: any }) => {
          //       if (tech.name === 'angular')
          //         for (const prop in tech) {
          //           if (prop === '_id') el = tech[prop];
          //         }
          //     });
          //   }
          //   if (el === 'BwftOZFW1rVIVf1zeeft') {
          //     technologiesList.forEach((tech: { name: string; _id: any }) => {
          //       if (tech.name === 'management')
          //         for (const prop in tech) {
          //           if (prop === '_id') el = tech[prop];
          //         }
          //     });
          //   }
          //   if (el === 'AX12nkhyTAxoMdZsNNF9') {
          //     technologiesList.forEach((tech: { name: string; _id: any }) => {
          //       if (tech.name === 'flutter')
          //         for (const prop in tech) {
          //           if (prop === '_id') el = tech[prop];
          //         }
          //     });
          //   }
          //   if (el === '1N3YfzOI6QxLk3DaVJDq') {
          //     technologiesList.forEach((tech: { name: string; _id: any }) => {
          //       if (tech.name === 'postgress')
          //         for (const prop in tech) {
          //           if (prop === '_id') el = tech[prop];
          //         }
          //     });
          //   }
          //   newProps.push(el);
          // });
          project = { ...project, [prop]: newProps };
        }
      }
      await db.collection(`${name}`).insertOne(project);
    }
}

refillDb();
