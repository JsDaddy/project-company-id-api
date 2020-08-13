import * as fs from 'fs';
import * as util from 'util';
import * as path from 'path';
// import * as mongoose from 'mongoose';
import * as mongodb from 'mongodb';
import * as ora from 'ora';
import { Db } from 'mongodb';
const dbName = 'company-id-mongodb';
const dbPath = 'mongodb://localhost:27017/company-id-mongodb';

const promisifiedFileRead: (
  filename: string,
) => Promise<Buffer> = util.promisify(fs.readFile);

// const promisifiedReadDir: (
//   filename: string,
// ) => Promise<string[]> = util.promisify(fs.readdir);

async function main(): Promise<void> {
  const spinner: ora.Ora = ora('Loading').start();
  try {
    spinner.text = 'Connect to db';
    const connection: mongodb.MongoClient = await mongodb.MongoClient.connect(
      dbPath,
      { useNewUrlParser: true },
    );
    const db: Db = connection.db(dbName);

    const projects: any[] = await readJSON('output/json-projects.json');
  } catch (e) {
    console.log(e);
  }
}
async function readJSON<T>(fileName: string): Promise<T> {
  const buffer: Buffer = await promisifiedFileRead(
    path.resolve(__dirname, fileName),
  );
  return JSON.parse(buffer.toString());
}
